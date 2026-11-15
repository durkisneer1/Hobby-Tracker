use sea_orm::prelude::DateTimeWithTimeZone;
use ts_rs::TS;

#[derive(serde::Serialize, serde::Deserialize, TS)]
pub struct IssueDto {
    #[ts(type = "number")]
    pub id: i64,
    pub title: String,
    pub description: Option<String>,
    #[ts(type = "string")]
    pub created_at: DateTimeWithTimeZone,
    #[ts(type = "string")]
    pub updated_at: DateTimeWithTimeZone,
}

impl From<crate::models::_entities::issues::Model> for IssueDto {
    fn from(m: crate::models::_entities::issues::Model) -> Self {
        Self {
            id: m.id,
            title: m.title,
            description: m.description,
            created_at: m.created_at,
            updated_at: m.updated_at,
        }
    }
}

#[derive(serde::Serialize, serde::Deserialize, TS)]
pub struct CreateIssue {
    pub title: String,
    pub description: Option<String>,
}

#[derive(serde::Serialize, serde::Deserialize, TS)]
pub struct UpdateIssue {
    pub title: String,
    pub description: Option<String>,
}
