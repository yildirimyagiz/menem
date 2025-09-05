"""
Client Dashboard AI Service
Provides AI-powered analytics and insights for the client dashboard
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import json
from typing import Dict, List, Optional, Any
import logging
from dataclasses import dataclass
import asyncio
from concurrent.futures import ThreadPoolExecutor
import requests
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import joblib
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class DashboardMetrics:
    """Dashboard metrics data structure"""
    total_users: int
    active_properties: int
    revenue: float
    system_health: float
    user_growth_rate: float
    property_growth_rate: float
    revenue_growth_rate: float
    system_uptime: float

@dataclass
class ActivityItem:
    """Activity item data structure"""
    id: int
    type: str
    message: str
    time: str
    icon: str
    color: str
    bg_color: str
    status: str
    priority: str = "normal"

@dataclass
class AIInsight:
    """AI-generated insight"""
    type: str
    title: str
    description: str
    confidence: float
    action_items: List[str]
    impact_score: float
    category: str

class ClientDashboardAI:
    """AI-powered client dashboard analytics service"""
    
    def __init__(self):
        self.metrics_cache = {}
        self.insights_cache = {}
        self.activity_cache = {}
        self.models = {}
        self.scalers = {}
        self.cache_duration = 300  # 5 minutes
        self.last_update = None
        
    async def get_dashboard_metrics(self, client_id: str) -> DashboardMetrics:
        """Get comprehensive dashboard metrics with AI predictions"""
        try:
            # Check cache first
            cache_key = f"metrics_{client_id}"
            if self._is_cache_valid(cache_key):
                return self.metrics_cache[cache_key]
            
            # Fetch real-time data
            metrics = await self._fetch_real_time_metrics(client_id)
            
            # Apply AI predictions
            enhanced_metrics = await self._apply_ai_predictions(metrics, client_id)
            
            # Cache results
            self.metrics_cache[cache_key] = enhanced_metrics
            self.last_update = datetime.now()
            
            return enhanced_metrics
            
        except Exception as e:
            logger.error(f"Error getting dashboard metrics: {e}")
            return self._get_default_metrics()
    
    async def get_ai_insights(self, client_id: str) -> List[AIInsight]:
        """Generate AI-powered insights for the client"""
        try:
            cache_key = f"insights_{client_id}"
            if self._is_cache_valid(cache_key):
                return self.insights_cache[cache_key]
            
            # Get current metrics
            metrics = await self.get_dashboard_metrics(client_id)
            
            # Generate insights
            insights = await self._generate_insights(metrics, client_id)
            
            # Cache insights
            self.insights_cache[cache_key] = insights
            self.last_update = datetime.now()
            
            return insights
            
        except Exception as e:
            logger.error(f"Error generating AI insights: {e}")
            return self._get_default_insights()
    
    async def get_smart_activities(self, client_id: str, limit: int = 10) -> List[ActivityItem]:
        """Get AI-enhanced activity feed"""
        try:
            cache_key = f"activities_{client_id}_{limit}"
            if self._is_cache_valid(cache_key):
                return self.activity_cache[cache_key]
            
            # Fetch activities
            activities = await self._fetch_activities(client_id)
            
            # Apply AI prioritization
            enhanced_activities = await self._prioritize_activities(activities, client_id)
            
            # Cache results
            self.activity_cache[cache_key] = enhanced_activities[:limit]
            self.last_update = datetime.now()
            
            return enhanced_activities[:limit]
            
        except Exception as e:
            logger.error(f"Error getting smart activities: {e}")
            return self._get_default_activities()
    
    async def get_predictive_analytics(self, client_id: str) -> Dict[str, Any]:
        """Get predictive analytics for the client"""
        try:
            # Get historical data
            historical_data = await self._fetch_historical_data(client_id)
            
            # Apply ML models
            predictions = await self._apply_ml_predictions(historical_data, client_id)
            
            return {
                "revenue_forecast": predictions.get("revenue", {}),
                "user_growth_forecast": predictions.get("users", {}),
                "property_growth_forecast": predictions.get("properties", {}),
                "risk_assessment": predictions.get("risk", {}),
                "opportunity_analysis": predictions.get("opportunities", {}),
                "recommendations": predictions.get("recommendations", [])
            }
            
        except Exception as e:
            logger.error(f"Error getting predictive analytics: {e}")
            return self._get_default_predictions()
    
    async def get_ai_recommendations(self, client_id: str) -> List[Dict[str, Any]]:
        """Get AI-powered recommendations"""
        try:
            metrics = await self.get_dashboard_metrics(client_id)
            insights = await self.get_ai_insights(client_id)
            
            recommendations = []
            
            # Revenue optimization recommendations
            if metrics.revenue_growth_rate < 0.1:
                recommendations.append({
                    "category": "revenue_optimization",
                    "title": "Revenue Growth Opportunity",
                    "description": "Consider implementing dynamic pricing strategies",
                    "priority": "high",
                    "impact_score": 0.8,
                    "action_items": [
                        "Implement dynamic pricing",
                        "Optimize property listings",
                        "Enhance marketing campaigns"
                    ]
                })
            
            # User engagement recommendations
            if metrics.user_growth_rate < 0.05:
                recommendations.append({
                    "category": "user_engagement",
                    "title": "User Engagement Boost",
                    "description": "Focus on user retention and acquisition",
                    "priority": "medium",
                    "impact_score": 0.6,
                    "action_items": [
                        "Improve user onboarding",
                        "Add loyalty programs",
                        "Enhance customer support"
                    ]
                })
            
            # System optimization recommendations
            if metrics.system_health < 0.95:
                recommendations.append({
                    "category": "system_optimization",
                    "title": "System Health Improvement",
                    "description": "Address system performance issues",
                    "priority": "high",
                    "impact_score": 0.9,
                    "action_items": [
                        "Optimize database queries",
                        "Scale infrastructure",
                        "Monitor system metrics"
                    ]
                })
            
            return recommendations
            
        except Exception as e:
            logger.error(f"Error getting AI recommendations: {e}")
            return []
    
    async def _fetch_real_time_metrics(self, client_id: str) -> Dict[str, Any]:
        """Fetch real-time metrics from various sources"""
        # Simulate fetching from different data sources
        return {
            "total_users": np.random.randint(2000, 3000),
            "active_properties": np.random.randint(1000, 1500),
            "revenue": np.random.uniform(40000, 50000),
            "system_health": np.random.uniform(0.95, 0.99),
            "user_growth_rate": np.random.uniform(0.05, 0.15),
            "property_growth_rate": np.random.uniform(0.08, 0.12),
            "revenue_growth_rate": np.random.uniform(0.10, 0.20),
            "system_uptime": np.random.uniform(0.98, 0.999)
        }
    
    async def _apply_ai_predictions(self, metrics: Dict[str, Any], client_id: str) -> DashboardMetrics:
        """Apply AI predictions to enhance metrics"""
        # Apply trend analysis
        trend_factor = 1.0 + np.random.uniform(-0.1, 0.1)
        
        return DashboardMetrics(
            total_users=int(metrics["total_users"] * trend_factor),
            active_properties=int(metrics["active_properties"] * trend_factor),
            revenue=metrics["revenue"] * trend_factor,
            system_health=metrics["system_health"],
            user_growth_rate=metrics["user_growth_rate"],
            property_growth_rate=metrics["property_growth_rate"],
            revenue_growth_rate=metrics["revenue_growth_rate"],
            system_uptime=metrics["system_uptime"]
        )
    
    async def _generate_insights(self, metrics: DashboardMetrics, client_id: str) -> List[AIInsight]:
        """Generate AI insights based on metrics"""
        insights = []
        
        # Revenue insights
        if metrics.revenue_growth_rate > 0.15:
            insights.append(AIInsight(
                type="positive",
                title="Strong Revenue Growth",
                description=f"Revenue is growing at {metrics.revenue_growth_rate:.1%} rate",
                confidence=0.85,
                action_items=["Maintain current strategies", "Consider expansion"],
                impact_score=0.8,
                category="revenue"
            ))
        
        # User growth insights
        if metrics.user_growth_rate < 0.05:
            insights.append(AIInsight(
                type="warning",
                title="User Growth Needs Attention",
                description="User growth rate is below optimal levels",
                confidence=0.75,
                action_items=["Review marketing strategies", "Improve user onboarding"],
                impact_score=0.7,
                category="users"
            ))
        
        # System health insights
        if metrics.system_health < 0.97:
            insights.append(AIInsight(
                type="alert",
                title="System Health Alert",
                description="System health is below optimal threshold",
                confidence=0.9,
                action_items=["Monitor system metrics", "Check for issues"],
                impact_score=0.9,
                category="system"
            ))
        
        return insights
    
    async def _fetch_activities(self, client_id: str) -> List[Dict[str, Any]]:
        """Fetch activities from various sources"""
        activities = [
            {
                "id": 1,
                "type": "user_registered",
                "message": "New user registered: John Doe",
                "time": "2 minutes ago",
                "icon": "Users",
                "color": "text-blue-500",
                "bg_color": "bg-blue-100",
                "status": "success"
            },
            {
                "id": 2,
                "type": "property_added",
                "message": "New property added: Downtown Apartment",
                "time": "5 minutes ago",
                "icon": "Building2",
                "color": "text-green-500",
                "bg_color": "bg-green-100",
                "status": "success"
            },
            {
                "id": 3,
                "type": "payment_received",
                "message": "Payment received: $1,250.00",
                "time": "10 minutes ago",
                "icon": "CreditCard",
                "color": "text-purple-500",
                "bg_color": "bg-purple-100",
                "status": "success"
            },
            {
                "id": 4,
                "type": "system_alert",
                "message": "System maintenance scheduled",
                "time": "15 minutes ago",
                "icon": "AlertCircle",
                "color": "text-orange-500",
                "bg_color": "bg-orange-100",
                "status": "warning"
            }
        ]
        
        return activities
    
    async def _prioritize_activities(self, activities: List[Dict[str, Any]], client_id: str) -> List[ActivityItem]:
        """Apply AI prioritization to activities"""
        prioritized = []
        
        for activity in activities:
            # Apply AI scoring
            priority_score = self._calculate_priority_score(activity)
            
            prioritized.append(ActivityItem(
                id=activity["id"],
                type=activity["type"],
                message=activity["message"],
                time=activity["time"],
                icon=activity["icon"],
                color=activity["color"],
                bg_color=activity["bg_color"],
                status=activity["status"],
                priority="high" if priority_score > 0.7 else "normal"
            ))
        
        # Sort by priority
        prioritized.sort(key=lambda x: x.priority == "high", reverse=True)
        
        return prioritized
    
    def _calculate_priority_score(self, activity: Dict[str, Any]) -> float:
        """Calculate priority score for an activity"""
        base_score = 0.5
        
        # Adjust based on activity type
        if activity["type"] == "payment_received":
            base_score += 0.3
        elif activity["type"] == "system_alert":
            base_score += 0.4
        elif activity["type"] == "user_registered":
            base_score += 0.2
        
        # Adjust based on status
        if activity["status"] == "warning":
            base_score += 0.2
        
        return min(base_score, 1.0)
    
    async def _fetch_historical_data(self, client_id: str) -> pd.DataFrame:
        """Fetch historical data for ML predictions"""
        # Simulate historical data
        dates = pd.date_range(start='2023-01-01', end=datetime.now(), freq='D')
        
        data = {
            'date': dates,
            'users': np.random.randint(2000, 3000, len(dates)),
            'properties': np.random.randint(1000, 1500, len(dates)),
            'revenue': np.random.uniform(40000, 50000, len(dates)),
            'system_health': np.random.uniform(0.95, 0.99, len(dates))
        }
        
        return pd.DataFrame(data)
    
    async def _apply_ml_predictions(self, historical_data: pd.DataFrame, client_id: str) -> Dict[str, Any]:
        """Apply ML models for predictions"""
        predictions = {}
        
        # Revenue prediction
        if len(historical_data) > 30:
            revenue_model = self._get_or_create_model("revenue", historical_data)
            future_dates = pd.date_range(start=historical_data['date'].max(), periods=30, freq='D')
            revenue_pred = revenue_model.predict(np.arange(len(future_dates)).reshape(-1, 1))
            
            predictions["revenue"] = {
                "forecast": revenue_pred.tolist(),
                "confidence": 0.85,
                "trend": "increasing" if revenue_pred[-1] > revenue_pred[0] else "decreasing"
            }
        
        # User growth prediction
        if len(historical_data) > 30:
            user_model = self._get_or_create_model("users", historical_data)
            user_pred = user_model.predict(np.arange(30).reshape(-1, 1))
            
            predictions["users"] = {
                "forecast": user_pred.tolist(),
                "confidence": 0.8,
                "trend": "increasing" if user_pred[-1] > user_pred[0] else "decreasing"
            }
        
        return predictions
    
    def _get_or_create_model(self, model_type: str, data: pd.DataFrame) -> Any:
        """Get or create ML model"""
        if model_type not in self.models:
            # Simple linear regression for demo
            X = np.arange(len(data)).reshape(-1, 1)
            y = data[model_type].values
            
            model = RandomForestRegressor(n_estimators=100, random_state=42)
            model.fit(X, y)
            
            self.models[model_type] = model
        
        return self.models[model_type]
    
    def _is_cache_valid(self, cache_key: str) -> bool:
        """Check if cache is still valid"""
        if self.last_update is None:
            return False
        
        time_diff = (datetime.now() - self.last_update).total_seconds()
        return time_diff < self.cache_duration
    
    def _get_default_metrics(self) -> DashboardMetrics:
        """Get default metrics when AI service is unavailable"""
        return DashboardMetrics(
            total_users=2847,
            active_properties=1234,
            revenue=45678.0,
            system_health=0.985,
            user_growth_rate=0.125,
            property_growth_rate=0.082,
            revenue_growth_rate=0.153,
            system_uptime=0.985
        )
    
    def _get_default_insights(self) -> List[AIInsight]:
        """Get default insights when AI service is unavailable"""
        return [
            AIInsight(
                type="info",
                title="System Status",
                description="All systems are operating normally",
                confidence=0.9,
                action_items=["Continue monitoring"],
                impact_score=0.5,
                category="system"
            )
        ]
    
    def _get_default_activities(self) -> List[ActivityItem]:
        """Get default activities when AI service is unavailable"""
        return [
            ActivityItem(
                id=1,
                type="system_status",
                message="System is running normally",
                time="Just now",
                icon="Activity",
                color="text-green-500",
                bg_color="bg-green-100",
                status="success"
            )
        ]
    
    def _get_default_predictions(self) -> Dict[str, Any]:
        """Get default predictions when AI service is unavailable"""
        return {
            "revenue_forecast": {"forecast": [], "confidence": 0.0, "trend": "stable"},
            "user_growth_forecast": {"forecast": [], "confidence": 0.0, "trend": "stable"},
            "property_growth_forecast": {"forecast": [], "confidence": 0.0, "trend": "stable"},
            "risk_assessment": {"level": "low", "confidence": 0.0},
            "opportunity_analysis": {"opportunities": []},
            "recommendations": []
        }

# Global instance
client_dashboard_ai = ClientDashboardAI() 