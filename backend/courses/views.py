from django.http import JsonResponse




def peer_id_view(request):
    peer_id = None
    if request.POST.get('id'):
        peer_id = request.POST.get("id")

    return JsonResponse(data={"peer_id": peer_id})
