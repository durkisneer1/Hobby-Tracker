use loco_rs::prelude::*;

async fn index() -> Result<Response> {
    format::text("Hobby Tracker is running")
}

async fn about() -> Result<Response> {
    format::text(
        "Hobby Tracker helps solo developers track issues across their projects. Next feature: creating issues.",
    )
}

pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/status/")
        .add("/", get(index))
        .add("/about", get(about))
}
