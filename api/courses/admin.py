from django.contrib import admin

from .models import Course, Enrollment, ScoreChange, Tag, CourseReview


class CourseAdminConfig(admin.ModelAdmin):
    list_display = (
        "title",
        "id",
        "is_active",
        "is_accepted",
        "get_owner_full_name",
        "duration",
        "course_date",
        "created_at",
    )
    autocomplete_fields = ("owner",)
    readonly_fields = ("created_at",)
    search_fields = ("owner__email", "title")
    list_filter = ("is_accepted", "is_active", "created_at", "course_date", "duration")
    list_editable = ("is_accepted",)
    save_on_top = True

    def get_owner_full_name(self, obj):
        return obj.owner.get_full_name()

    get_owner_full_name.short_description = "Twórca kursu"


admin.site.register(Course, CourseAdminConfig)
admin.site.register(CourseReview)
admin.site.register(Enrollment)
admin.site.register(ScoreChange)
admin.site.register(Tag)
