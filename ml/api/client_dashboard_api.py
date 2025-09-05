"""
Client Dashboard AI API
FastAPI endpoints for client dashboard AI services
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import asyncio
import json
import logging
from datetime import datetime
import sys
import os

# Add the services directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'services'))

from client_dashboard_ai import ClientDashboardAI, DashboardMetrics, ActivityItem, AIInsight

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Client Dashboard AI API",
    description="AI-powered analytics and insights for client dashboard",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI service
ai_service = ClientDashboardAI()

# Pydantic models for request/response
class MetricsRequest(BaseModel):
    client_id: str

class MetricsResponse(BaseModel):
    total_users: int
    active_properties: int
    revenue: float
    system_health: float
    user_growth_rate: float
    property_growth_rate: float
    revenue_growth_rate: float
    system_uptime: float
    timestamp: str

class InsightResponse(BaseModel):
    type: str
    title: str
    description: str
    confidence: float
    action_items: List[str]
    impact_score: float
    category: str

class ActivityResponse(BaseModel):
    id: int
    type: str
    message: str
    time: str
    icon: str
    color: str
    bg_color: str
    status: str
    priority: str

class RecommendationResponse(BaseModel):
    category: str
    title: str
    description: str
    priority: str
    impact_score: float
    action_items: List[str]

class PredictiveAnalyticsResponse(BaseModel):
    revenue_forecast: Dict[str, Any]
    user_growth_forecast: Dict[str, Any]
    property_growth_forecast: Dict[str, Any]
    risk_assessment: Dict[str, Any]
    opportunity_analysis: Dict[str, Any]
    recommendations: List[Dict[str, Any]]

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Client Dashboard AI API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "client_dashboard_ai"
    }

@app.post("/metrics", response_model=MetricsResponse)
async def get_dashboard_metrics(request: MetricsRequest):
    """Get AI-enhanced dashboard metrics"""
    try:
        metrics = await ai_service.get_dashboard_metrics(request.client_id)
        
        return MetricsResponse(
            total_users=metrics.total_users,
            active_properties=metrics.active_properties,
            revenue=metrics.revenue,
            system_health=metrics.system_health,
            user_growth_rate=metrics.user_growth_rate,
            property_growth_rate=metrics.property_growth_rate,
            revenue_growth_rate=metrics.revenue_growth_rate,
            system_uptime=metrics.system_uptime,
            timestamp=datetime.now().isoformat()
        )
    except Exception as e:
        logger.error(f"Error getting dashboard metrics: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/insights", response_model=List[InsightResponse])
async def get_ai_insights(request: MetricsRequest):
    """Get AI-generated insights"""
    try:
        insights = await ai_service.get_ai_insights(request.client_id)
        
        return [
            InsightResponse(
                type=insight.type,
                title=insight.title,
                description=insight.description,
                confidence=insight.confidence,
                action_items=insight.action_items,
                impact_score=insight.impact_score,
                category=insight.category
            )
            for insight in insights
        ]
    except Exception as e:
        logger.error(f"Error getting AI insights: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/activities", response_model=List[ActivityResponse])
async def get_smart_activities(request: MetricsRequest, limit: int = 10):
    """Get AI-enhanced activity feed"""
    try:
        activities = await ai_service.get_smart_activities(request.client_id, limit)
        
        return [
            ActivityResponse(
                id=activity.id,
                type=activity.type,
                message=activity.message,
                time=activity.time,
                icon=activity.icon,
                color=activity.color,
                bg_color=activity.bg_color,
                status=activity.status,
                priority=activity.priority
            )
            for activity in activities
        ]
    except Exception as e:
        logger.error(f"Error getting smart activities: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recommendations", response_model=List[RecommendationResponse])
async def get_ai_recommendations(request: MetricsRequest):
    """Get AI-powered recommendations"""
    try:
        recommendations = await ai_service.get_ai_recommendations(request.client_id)
        
        return [
            RecommendationResponse(
                category=rec["category"],
                title=rec["title"],
                description=rec["description"],
                priority=rec["priority"],
                impact_score=rec["impact_score"],
                action_items=rec["action_items"]
            )
            for rec in recommendations
        ]
    except Exception as e:
        logger.error(f"Error getting AI recommendations: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predictive-analytics", response_model=PredictiveAnalyticsResponse)
async def get_predictive_analytics(request: MetricsRequest):
    """Get predictive analytics"""
    try:
        analytics = await ai_service.get_predictive_analytics(request.client_id)
        
        return PredictiveAnalyticsResponse(
            revenue_forecast=analytics.get("revenue_forecast", {}),
            user_growth_forecast=analytics.get("user_growth_forecast", {}),
            property_growth_forecast=analytics.get("property_growth_forecast", {}),
            risk_assessment=analytics.get("risk_assessment", {}),
            opportunity_analysis=analytics.get("opportunity_analysis", {}),
            recommendations=analytics.get("recommendations", [])
        )
    except Exception as e:
        logger.error(f"Error getting predictive analytics: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/dashboard-summary")
async def get_dashboard_summary(request: MetricsRequest):
    """Get comprehensive dashboard summary with all AI insights"""
    try:
        # Get all data concurrently
        metrics_task = ai_service.get_dashboard_metrics(request.client_id)
        insights_task = ai_service.get_ai_insights(request.client_id)
        activities_task = ai_service.get_smart_activities(request.client_id, 5)
        recommendations_task = ai_service.get_ai_recommendations(request.client_id)
        analytics_task = ai_service.get_predictive_analytics(request.client_id)
        
        # Wait for all tasks to complete
        metrics, insights, activities, recommendations, analytics = await asyncio.gather(
            metrics_task, insights_task, activities_task, recommendations_task, analytics_task
        )
        
        return {
            "metrics": {
                "total_users": metrics.total_users,
                "active_properties": metrics.active_properties,
                "revenue": metrics.revenue,
                "system_health": metrics.system_health,
                "user_growth_rate": metrics.user_growth_rate,
                "property_growth_rate": metrics.property_growth_rate,
                "revenue_growth_rate": metrics.revenue_growth_rate,
                "system_uptime": metrics.system_uptime
            },
            "insights": [
                {
                    "type": insight.type,
                    "title": insight.title,
                    "description": insight.description,
                    "confidence": insight.confidence,
                    "action_items": insight.action_items,
                    "impact_score": insight.impact_score,
                    "category": insight.category
                }
                for insight in insights
            ],
            "activities": [
                {
                    "id": activity.id,
                    "type": activity.type,
                    "message": activity.message,
                    "time": activity.time,
                    "icon": activity.icon,
                    "color": activity.color,
                    "bg_color": activity.bg_color,
                    "status": activity.status,
                    "priority": activity.priority
                }
                for activity in activities
            ],
            "recommendations": recommendations,
            "predictive_analytics": analytics,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error getting dashboard summary: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/cache/clear")
async def clear_cache(request: MetricsRequest):
    """Clear cache for a specific client"""
    try:
        # Clear all caches for the client
        cache_keys = [key for key in ai_service.metrics_cache.keys() if request.client_id in key]
        for key in cache_keys:
            del ai_service.metrics_cache[key]
        
        cache_keys = [key for key in ai_service.insights_cache.keys() if request.client_id in key]
        for key in cache_keys:
            del ai_service.insights_cache[key]
        
        cache_keys = [key for key in ai_service.activity_cache.keys() if request.client_id in key]
        for key in cache_keys:
            del ai_service.activity_cache[key]
        
        return {
            "message": "Cache cleared successfully",
            "client_id": request.client_id,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error clearing cache: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/cache/status")
async def get_cache_status():
    """Get cache status"""
    try:
        return {
            "metrics_cache_size": len(ai_service.metrics_cache),
            "insights_cache_size": len(ai_service.insights_cache),
            "activity_cache_size": len(ai_service.activity_cache),
            "last_update": ai_service.last_update.isoformat() if ai_service.last_update else None,
            "cache_duration": ai_service.cache_duration
        }
    except Exception as e:
        logger.error(f"Error getting cache status: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001) 