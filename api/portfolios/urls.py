from .viewsets import ProjectViewSet
from rest_framework import routers

router = routers.SimpleRouter()
router.register(r"projects", ProjectViewSet, basename="project")

urlpatterns = router.urls
