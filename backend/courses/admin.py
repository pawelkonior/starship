from django.contrib import admin
from .models import Course, ProgrammePoint, Tag, Roadmap, LearningStages, Enrollment, Project, Picture


class CustomProjectAdmin(admin.ModelAdmin):
    list_display = ("name", "owner")
    list_editable = ("owner",)

admin.site.register(Course)
admin.site.register(ProgrammePoint)
admin.site.register(Tag)
admin.site.register(Roadmap)
admin.site.register(LearningStages)
admin.site.register(Enrollment)
admin.site.register(Project, CustomProjectAdmin)
admin.site.register(Picture)
