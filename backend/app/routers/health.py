from fastapi import APIRouter

from app.db.supabase_client import get_supabase

router = APIRouter()


@router.get("/health")
def health_check():
    supabase = get_supabase()
    result = supabase.table("documents").select("id", count="exact").limit(1).execute()
    return {
        "status": "ok",
        "supabase_connected": True,
        "documents_table_reachable": result.count is not None,
    }
