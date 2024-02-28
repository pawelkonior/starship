from django.contrib import admin
from .models import Project, ProjectImage


class ProjectImageAdmin(admin.ModelAdmin):
    list_display = ["project", "image"]
    search_fields = ["project__title"]


class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    fk_name = "project"


class ProjectAdmin(admin.ModelAdmin):
    list_display = ["title", "owner"]
    search_fields = ["title", "owner__username", "tags__name"]
    inlines = [
        ProjectImageInline,
    ]


admin.site.register(Project, ProjectAdmin)
admin.site.register(ProjectImage, ProjectImageAdmin)
