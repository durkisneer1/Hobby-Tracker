#![allow(clippy::unused_async)]
use axum::http::StatusCode;
use loco_rs::prelude::*;

use crate::{
    dtos::{
        common::{ApiError, Page},
        issues::{CreateIssue, IssueDto, UpdateIssue},
    },
    models::_entities::issues::{ActiveModel, Column, Entity},
};

/// Build a 404 response shaped as the [`ApiError`] envelope.
fn not_found(message: &str) -> Response {
    let error = ApiError {
        code: "not_found".to_string(),
        message: message.to_string(),
        details: None,
    };
    (StatusCode::NOT_FOUND, Json(error)).into_response()
}

#[debug_handler]
async fn list(
    State(ctx): State<AppContext>,
    Query(pagination): Query<query::PaginationQuery>,
) -> Result<Json<Page<IssueDto>>> {
    let res = query::paginate(
        &ctx.db,
        Entity::find().order_by_asc(Column::Id),
        None,
        &pagination,
    )
    .await?;

    Ok(Json(Page::from_query(res)))
}

#[debug_handler]
async fn get_one(State(ctx): State<AppContext>, Path(id): Path<i64>) -> Result<Response> {
    let Some(model) = Entity::find_by_id(id).one(&ctx.db).await? else {
        return Ok(not_found("issue not found"));
    };
    Ok(Json(IssueDto::from(model)).into_response())
}

#[debug_handler]
async fn create(
    State(ctx): State<AppContext>,
    Json(params): Json<CreateIssue>,
) -> Result<Response> {
    if params.title.trim().is_empty() {
        return Ok((
            StatusCode::BAD_REQUEST,
            Json(serde_json::json!({
                "error": "Title must contain non-whitespace characters."
            })),
        )
            .into_response());
    }

    let item = ActiveModel {
        title: Set(params.title.trim().to_string()),
        description: Set(params.description),
        ..Default::default()
    };
    let item = item.insert(&ctx.db).await?;

    Ok((StatusCode::CREATED, Json(IssueDto::from(item))).into_response())
}

#[debug_handler]
async fn update(
    State(ctx): State<AppContext>,
    Path(id): Path<i64>,
    Json(params): Json<UpdateIssue>,
) -> Result<Response> {
    let Some(model) = Entity::find_by_id(id).one(&ctx.db).await? else {
        return Ok(not_found("issue not found"));
    };

    let mut item = model.into_active_model();
    item.title = Set(params.title);
    item.description = Set(params.description);
    let item = item.update(&ctx.db).await?;

    Ok(Json(IssueDto::from(item)).into_response())
}

#[debug_handler]
async fn remove(State(ctx): State<AppContext>, Path(id): Path<i64>) -> Result<Response> {
    let Some(model) = Entity::find_by_id(id).one(&ctx.db).await? else {
        return Ok(not_found("issue not found"));
    };

    model.into_active_model().delete(&ctx.db).await?;

    Ok(StatusCode::NO_CONTENT.into_response())
}

pub fn routes() -> Routes {
    Routes::new()
        .prefix("/api/issues")
        .add("/", get(list))
        .add("/", post(create))
        .add("/{id}", get(get_one))
        .add("/{id}", put(update))
        .add("/{id}", delete(remove))
}
