from django.shortcuts import render, redirect
from django.http import JsonResponse
import json
import requests
from django.views.decorators.csrf import csrf_exempt, csrf_protect
import string
from concurrent.futures import ThreadPoolExecutor
import io
import base64
from PIL import Image
from googletrans import Translator, LANGUAGES
from io import BytesIO
from rembg import remove
import requests
from django.contrib.auth.decorators import login_required
from .models import CustomUser
from .forms import EmailForm
from django.core.mail import EmailMultiAlternatives
from django.middleware.csrf import get_token
from django.views.generic import RedirectView
from django.urls import reverse
from rest_framework.decorators import api_view
import websocket
import uuid
import urllib.request
import urllib.parse
import random
import os

class GoogleSignInView(RedirectView):
    def get_redirect_url(self, *args, **kwargs):
        return reverse('social:begin', args=['google-oauth2'])

def index(request):
    return render(request, "index.html")

@csrf_protect
def about_us(request):
    return render(request, "about-us.html")

@csrf_protect
def term_of_use(request):
    return render(request, "term-of-use.html")

@csrf_protect
def pricing(request):
    return render(request, "pricing.html")

@csrf_protect
def contact(request):
    return render(request, "contact.html")

@csrf_protect
def privacy_policy(request):
    return render(request, "privacy-policy.html")

@csrf_protect
@login_required
def projectChoose(request):
    if not request.user.is_authenticated or not request.user.id:
        return JsonResponse({"error": "Unauthorized access."}, status=401)

    try:
        custom_user = CustomUser.objects.get(id=request.user.id)
    except CustomUser.DoesNotExist:
        return JsonResponse({"error": "User does not exist."}, status=404)
    user = CustomUser.objects.get(id=request.user.id)
    context = {'user': user}
    return render(request, "project.html", context)

@csrf_protect
@login_required
def userInfo(request):
    if not request.user.is_authenticated or not request.user.id:
        return JsonResponse({"error": "Unauthorized access."}, status=401)

    try:
        json_data = json.loads(request.body)
        c_value = json_data.get("v")
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON format in request body."}, status=400)
    
    try:
        custom_user = CustomUser.objects.get(id=request.user.id)
    except CustomUser.DoesNotExist:
        return JsonResponse({"error": "User does not exist."}, status=404)
    
    c_front_value = None
    t_front_value = None

    if c_value == "1":
        c_front_value = custom_user.c1
        t_front_value = custom_user.t1
    elif c_value == "2":
        c_front_value = custom_user.c2
        t_front_value = custom_user.t2
    elif c_value == "3":
        c_front_value = custom_user.c3
        t_front_value = custom_user.t3
    elif c_value == "4":
        c_front_value = custom_user.c4
        t_front_value = custom_user.t4
    elif c_value == "5":
        c_front_value = custom_user.c5
        t_front_value = custom_user.t5
    elif c_value == "6":
        c_front_value = custom_user.c6
        t_front_value = custom_user.t6
    elif c_value == "7":
        c_front_value = custom_user.c7
        t_front_value = custom_user.t7
    elif c_value == "8":
        c_front_value = custom_user.c8
        t_front_value = custom_user.t8
    elif c_value == "9":
        c_front_value = custom_user.c9
        t_front_value = custom_user.t9
    elif c_value == "10":
        c_front_value = custom_user.c10
        t_front_value = custom_user.t10
    else:
        return JsonResponse({"error": "Invalid c value."}, status=400)

    return JsonResponse({'c': c_front_value, 't': t_front_value})

@csrf_protect
@login_required
def editor(request):
    if not request.user.is_authenticated or not request.user.id:
        return JsonResponse({"error": "Unauthorized access."}, status=401)

    # Kullanıcının kredi kontrolü ve azaltma işlemi
    try:
        custom_user = CustomUser.objects.get(id=request.user.id)
    except CustomUser.DoesNotExist:
        return JsonResponse({"error": "User does not exist."}, status=404)
    user = CustomUser.objects.get(id=request.user.id)
    context = {'user': user}
    return render(request, "editor.html", context)

@csrf_protect
@login_required
def editorFree(request):
    if not request.user.is_authenticated or not request.user.id:
        return JsonResponse({"error": "Unauthorized access."}, status=401)

    # Kullanıcının kredi kontrolü ve azaltma işlemi
    try:
        custom_user = CustomUser.objects.get(id=request.user.id)
    except CustomUser.DoesNotExist:
        return JsonResponse({"error": "User does not exist."}, status=404)
    user = CustomUser.objects.get(id=request.user.id)
    context = {'user': user}
    return render(request, "editor-free.html", context)

@login_required
@csrf_protect
def generate_canvas(request):
    image_list = []

    # Kullanıcının Google ile giriş yapmış olduğunu ve id'sinin mevcut olduğunu kontrol ediyoruz
    if not request.user.is_authenticated or not request.user.id:
        return JsonResponse({"error": "Unauthorized access."}, status=401)

    # Kullanıcının kredi kontrolü ve azaltma işlemi
    try:
        custom_user = CustomUser.objects.get(id=request.user.id)
    except CustomUser.DoesNotExist:
        return JsonResponse({"error": "User does not exist."}, status=404)
    
    if custom_user.credit < 5:  # Kullanıcı işlem yapmak için yeterli krediye sahip değilse
        return JsonResponse({"error": "Insufficient credit."}, status=400)

    # Kredi azaltma işlemi
    original_credit = custom_user.credit
    custom_user.credit -= 5
    custom_user.save()

    try:
        with open('quviapi/blacklist.txt', 'r', encoding='utf-8') as file:
            blacklist = set(line.strip().lower() for line in file)

        json_data = json.loads(request.body)
        prompt_value = json_data.get("prompt")
        prompt_value = translate(prompt_value)
        negative_prompt_value = json_data.get("negative-prompt")
        negative_prompt_value = translate(negative_prompt_value)
        mask_prompt = json_data.get("maskPrompt")
        mask_prompt = translate(mask_prompt)

        punctuations = string.punctuation
        for char in punctuations:
            prompt_value = prompt_value.replace(char, f" {char} ")

        snp = "nsfw, bad anatomy, bad proportions, blurry, cloned face, cropped, deformed, dehydrated, disfigured, duplicate, error, extra arms, extra legs, extra limbs, fused fingers, gross proportons, jpeg artifacts, long neck, low quality, lowres, malformed limbs, missing arms, missing legs, morbid, mutated hands, mutation, mutilated, out of frame, poorly drawn face, poorly drawn hands, signature, text, too many fingers, ugly, username, watermark, worst quality, "+"nsfw, "+"nude, "+"sex, "+"anal, "+"sexuality, "+"porn, "+"dick, "+"cock, "+"vagina, "+"tit, "+"tits, "+"boobs, "+"cunt, "+"blowjob, "+"handjob, "+"pornography, "+"ass, "+"gay, "+"pee, "+"bad pixels, "+"lowres, "+"medium resolution, "+"low resolution, "+"deformation, "+"blurry, "+"deformed, "+"cropped, "+"low quality, "+"text, "+"worst quality, "+"username, "+"out of frame, "+"jpeg artifacts, "+"duplicate, "+"disfigured, "+"error, "+"bad illustration, "+"di512rted, "+"fault, "+"hazy, "+"flaw, "+"logo, "+"incorrect ratio, "+"mistake, "+"pixelated, "+"script, "+"sign, "+"tiling, "+"distorted details, "+"opaque, "+"underexposed, "+"surreal, "+"distortion, "+"text, "

        prompt_words = [word.strip().lower() for word in prompt_value.split() if word.strip().lower() not in blacklist]
        prompt_value = ' '.join(prompt_words)

        imageInCanvas = json_data.get("image")
        imageInCanvas = imageInCanvas[22:]
        
        styleDraw = json_data.get("style")
        weather = json_data.get("weather")
        invertedValue = json_data.get("maskInvert")
        
        scale_value = json_data.get("scale")
        if scale_value == 's':
            scale_value = 1
        elif scale_value == 'h':
            scale_value = 2
        elif scale_value == 'v':
            scale_value = 3
        elif scale_value == 'h2':
            scale_value = 4
        elif scale_value == 'v2':
            scale_value = 5
            
        if scale_value == 1:
            height = 768
            width = 768
        elif scale_value == 2:
            height = 576
            width = 768
        elif scale_value == 3:
            height = 768
            width = 576
        elif scale_value == 4:
            height = 432
            width = 768
        elif scale_value == 5:
            height = 768
            width = 432

        inorex = json_data.get("design")

        if inorex =='Interior':
            styles = ["sai-photographic", styleDraw, inorex, weather ]
        elif inorex == 'Exterior':
            styles = ["sai-photographic", styleDraw, inorex, weather ]
        elif inorex == 'floor-plan':
            styles = ["sai-photographic", "floorplan"]
        elif inorex == 'landscape':
            styles = ["sai-photographic", "landscape" ]
        elif inorex == 'free':
            styles = [styleDraw]

        buffer = io.BytesIO()
        imgdata = base64.b64decode(imageInCanvas)
        img = Image.open(io.BytesIO(imgdata))
        img = img.resize((width, height))
        img.save(buffer, format="PNG")
        imageInCanvas = base64.b64encode(buffer.getvalue()).decode("utf-8")

        mask = json_data.get("mask")
        if mask_prompt == "":
            if mask == 0:
                mask = mask
            else:
                mask = mask[22:]
                buffer2 = io.BytesIO()
                maskdata = base64.b64decode(mask)
                img2 = Image.open(io.BytesIO(maskdata))
                img2 = img2.resize((width, height))
                img2.save(buffer2, format="PNG")
                mask = base64.b64encode(buffer2.getvalue()).decode("utf-8")
        else:
            mask = auto_mask(imageInCanvas, mask_prompt)

        def api_request(url, payload):
            response = requests.post(url, json=payload)
            return response

        with ThreadPoolExecutor() as executor:
            if mask != 0:
                payload = {
                    "prompt": prompt_value,
                    "negative_prompt": snp,
                    "seed": -1,
                    "subseed": -1,
                    "cfg_scale": 2,
                    "mask_blur": 8,
                    "mask_blur_x": 8,
                    "mask_blur_y": 8,
                    "mask_transparancy": 0,
                    "height": height,
                    "width": width,
                    "sampler_name": "DPM++ SDE",
                    "scheduler": "Karras",
                    "image_cfg_scale": 1,
                    "resize_mode": 0,
                    "resize_by": 1,
                    "init_images": [imageInCanvas],
                    "steps": 8,
                    "denoising_strength": 0.75,
                    "batch_size": 4,
                    "mask": mask,
                    "mask_mode": 0,
                    "inpainting_fill": 1,
                    "inpaint_full_res": True,
                    "inpaint_full_res_padding": 20,
                    "include_init_images": True,
                    "restore_faces": True,
                    "inpainting_mask_invert": invertedValue,
                    "alwayson_scripts": {}
                }
                response_future = executor.submit(api_request, f'http://127.0.0.1:7863/sdapi/v1/img2img', payload)
            else:
                payload = {
                    "prompt": prompt_value,
                    "negative_prompt": negative_prompt_value,
                    "seed": -1,
                    "cfg_scale": 2,
                    "image_cfg_scale": 35,
                    "height": height,
                    "width": width,
                    "init_images": [imageInCanvas],
                    "steps": 4,
                    "denoising_strength": 1,
                    "styles": styles,
                    "batch_size": 4,
                    "sampler_name": "DPM++ SDE",
                    "scheduler": "Karras",
                    "restore_faces": True,
                    "alwayson_scripts": {
                        "controlnet": {
                            "args": [
                                {
                                    "enabled": True,
                                    "module": "canny",
                                    "model": "diffusers_xl_canny_full [2b69fca4]",
                                    "weight": 1,
                                    "resize_mode": 0,
                                    "image": imageInCanvas,
                                    "lowvram": False,
                                    "threshold_a": 1,
                                    "threshold_b": 255,
                                    "guidance_start": 0.0,
                                    "guidance_end": 1.0,
                                    "control_mode": 1,
                                    "pixel_perfect": True
                                }
                            ]
                        }
                    }
                }
                response_future = executor.submit(api_request, f'http://127.0.0.1:7861/sdapi/v1/img2img', payload)

        response = response_future.result()

        if response.status_code == 200:
            r = response.json()
            for idx, i in enumerate(r['images']):
                img = (i.split(",", 1)[0])
                image_list.append(img)
            return JsonResponse({"image": image_list, "credit": custom_user.credit})
        else:
            # Kredi iadesi
            custom_user.credit = original_credit
            custom_user.save()
            return JsonResponse({"error": "API request failed. Credit has been refunded."}, status=500)
    
    except Exception as e:
        # Kredi iadesi
        custom_user.credit = original_credit
        custom_user.save()
        return JsonResponse({"error": f"An error occurred: {str(e)}. Credit has been refunded."}, status=500)

@login_required
@csrf_exempt
def remove_objects(request):
    try:
        json_data = json.loads(request.body)
        prompt = json_data.get("prompt")
        image = json_data.get("image")
        scale_value = json_data.get("scale")
        if scale_value == 's':
            scale_value = 1
        elif scale_value == 'h':
            scale_value = 2
        elif scale_value == 'v':
            scale_value = 3
        elif scale_value == 'h2':
            scale_value = 4
        elif scale_value == 'v2':
            scale_value = 5
            
        if scale_value == 1:
            height = 768
            width = 768
        elif scale_value == 2:
            height = 576
            width = 768
        elif scale_value == 3:
            height = 768
            width = 576
        elif scale_value == 4:
            height = 432
            width = 768
        elif scale_value == 5:
            height = 768
            width = 432
        
        mask = json_data.get("mask")
        mask = mask[22:]
        buffer2 = io.BytesIO()
        maskdata = base64.b64decode(mask)
        img2 = Image.open(io.BytesIO(maskdata))
        img2 = img2.resize((width, height))
        img2.save(buffer2, format="PNG")
        mask = base64.b64encode(buffer2.getvalue()).decode("utf-8")

        def api_request(url, payload):
            response = requests.post(url, json=payload)
            return response

        with ThreadPoolExecutor() as executor:
            payload = {
                "input_image": image,
                "mask": mask
            }
            response_future = executor.submit(api_request, f'http://127.0.0.1:7863/cleanup', payload)

        response = response_future.result()

        r = response.json()
        img = r['image']
        return JsonResponse({"image": img})
    
    except Exception as e:
        return JsonResponse({"error": f"An error occurred: {str(e)}."}, status=500)


def auto_mask(image, prompt):
        try:
            def api_request(url, payload):
                response = requests.post(url, json=payload)
                return response.json()

            with ThreadPoolExecutor() as executor:
                payload = {
                    "sam_model_name": "sam_vit_h_4b8939.pth",
                    "input_image": image,
                    "sam_positive_points": [],
                    "dino_enabled": True,
                    "dino_model_name": "GroundingDINO_SwinB (938MB)",
                    "dino_text_prompt": prompt,
                    "dino_box_threshold": 0.3
                }
                response_future = executor.submit(api_request, f'http://127.0.0.1:7863/sam/sam-predict', payload)

            response = response_future.result()

            if "masked_images" in response and response["masked_images"]:
                masked_image = response["masked_images"][2]
                return masked_image
            else:
                return JsonResponse({"error": "Image processing failed: no masked images found"}, status=500)

        except Exception as e:
            return JsonResponse({"error": f"Image processing failed: {str(e)}"}, status=500)

@login_required
@csrf_exempt
def download_image(request):
    try:
        json_data = json.loads(request.body)
        image = json_data.get("image")

        def api_request(url, payload):
            response = requests.post(url, json=payload)
            return response.json()

        with ThreadPoolExecutor() as executor:
            payload = {
                "resize_mode": 0,
                "upscaling_resize": 2,
                "upscaler_1": "R-ESRGAN 4x+",
                "image": image
            }
            response_future = executor.submit(api_request, f'http://127.0.0.1:7862/sdapi/v1/extra-single-image', payload)

        response = response_future.result()

        if "image" in response:
            image = response["image"]
            return JsonResponse({"image": image})
        else:
            return JsonResponse({"error": "Image processing failed: no image found in response"}, status=500)

    except Exception as e:
        return JsonResponse({"error": f"Image processing failed: {str(e)}"}, status=500)

@login_required
@csrf_protect
def background_cleaner(request):
    if request.method == 'POST':
        try:
            json_data = json.loads(request.body)
            image = json_data.get("image")
            image = image[22:]
            decoded_image = base64.b64decode(image)
            image = Image.open(BytesIO(decoded_image))

            output = remove(image)
            
            buffer = BytesIO()
            output.save(buffer, format="PNG")
            output_bytes = buffer.getvalue()

            encoded_image_str = base64.b64encode(output_bytes).decode('utf-8')

            return JsonResponse({"image": encoded_image_str})

        except Exception as e:
            return JsonResponse({"error": f"Image processing failed: {str(e)}"})

    return JsonResponse({"error": "Invalid request method"})

def translate(text):
    if text:
        translator = Translator()

        try:
            detected_language = translator.detect(text)

            if detected_language is not None and detected_language.lang in LANGUAGES:
                detected_language = detected_language.lang
                translated_text = translator.translate(text, src=detected_language, dest='en')

                if translated_text is not None:
                    return translated_text.text
                else:
                    return "Failed to translate"
        except Exception as e:
            return text
    else:
        return ""

@csrf_protect
@login_required
def save_canvas_data(request):
    try:
        if not request.user.is_authenticated or not request.user.id:
            return JsonResponse({"error": "Unauthorized access."}, status=401)

        custom_user = CustomUser.objects.get(username=request.user.username)

        if request.method == 'POST':
            json_data = json.loads(request.body)
            canvas_json_data = json_data.get('canvas_json_data')
            cclear = json_data.get('valueC')
            layers = json_data.get('layerDataFront')
            canvasImage = json_data.get('backendUrl')

            if cclear == "1":
                custom_user.c1 = canvas_json_data
                custom_user.t1 = layers
                custom_user.ci1 = canvasImage
            elif cclear == "2":
                custom_user.c2 = canvas_json_data
                custom_user.t2 = layers
                custom_user.ci2 = canvasImage
            elif cclear == "3":
                custom_user.c3 = canvas_json_data
                custom_user.t3 = layers
                custom_user.ci3 = canvasImage
            elif cclear == "4":
                custom_user.c4 = canvas_json_data
                custom_user.t4 = layers
                custom_user.ci4 = canvasImage
            elif cclear == "5":
                custom_user.c5 = canvas_json_data
                custom_user.t5 = layers
                custom_user.ci5 = canvasImage
            elif cclear == "6":
                custom_user.c6 = canvas_json_data
                custom_user.t6 = layers
                custom_user.ci6 = canvasImage
            elif cclear == "7":
                custom_user.c7 = canvas_json_data
                custom_user.t7 = layers
                custom_user.ci7 = canvasImage
            elif cclear == "8":
                custom_user.c8 = canvas_json_data
                custom_user.t8 = layers
                custom_user.ci8 = canvasImage
            elif cclear == "9":
                custom_user.c9 = canvas_json_data
                custom_user.t9 = layers
                custom_user.ci9 = canvasImage
            elif cclear == "10":
                custom_user.c10 = canvas_json_data
                custom_user.t10 = layers
                custom_user.ci10 = canvasImage
            
            custom_user.save()
            return JsonResponse({"message": "Data saved successfully"})
        else:
            return JsonResponse({"error": "Only POST requests are allowed."}, status=405)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    

@csrf_exempt
def get_csrf_token(request):
    token = get_token(request)
    return JsonResponse({'csrfToken': token})

@login_required
def unsubscribe(request):
    if not request.user.is_authenticated or not request.user.id:
        return JsonResponse({"error": "Unauthorized access."}, status=401)
    try:
        custom_user = CustomUser.objects.get(id=request.user.id)
    except CustomUser.DoesNotExist:
        return JsonResponse({"error": "User does not exist."}, status=404)
    custom_user.is_subscribed = False
    custom_user.save()
    return render(request, 'unsubscribe.html', {'message': 'You unsubscribed successfully.'})


@login_required
def send_bulk_emails_view(request):
    try:
        custom_user = CustomUser.objects.get(id=request.user.id)
    except CustomUser.DoesNotExist:
        return JsonResponse({"error": "User does not exist."}, status=404)
    if not custom_user.is_superuser:
        return redirect('/')  

    if request.method == 'POST':
        form = EmailForm(request.POST, request.FILES)
        if form.is_valid():
            email_subject = form.cleaned_data['email_subject']
            email_template = form.cleaned_data['email_template']
            
            # Dosya içeriğini oku
            email_body = email_template.read().decode('utf-8')

            users = CustomUser.objects.filter(is_subscribed=True)
            for user in users:
                unsubscribe_url = f"http://127.0.0.1:8000/unsubscribe/"
                full_email_body = f"{email_body}\n\nTo unsubscribe, click here: {unsubscribe_url}"

                email = EmailMultiAlternatives(
                    subject=email_subject,
                    body='',
                    from_email='quickvisionai@gmail.com',
                    to=[user.email],
                )
                email.attach_alternative(full_email_body, "text/html")
                email.send()

            return redirect('email_sent_success')
    else:
        form = EmailForm()
    return render(request, 'send_bulk_emails.html', {'form': form})

@login_required
def email_sent_success_view(request):
    try:
        custom_user = CustomUser.objects.get(id=request.user.id)
    except CustomUser.DoesNotExist:
        return JsonResponse({"error": "User does not exist."}, status=404)
    if not custom_user.is_superuser:
        return redirect('/')

    return render(request, 'email_sent_success.html')

# Sunucu adresi ve istemci kimliği
server_address = "192.168.1.125:8188"
client_id = str(uuid.uuid4())

# Prompt işleme fonksiyonu
def process_prompt(prompt_exempt, height, width, style):
    with open('prompt.json', 'r', encoding='utf-8') as file:
        prompt = json.load(file)
    
    prompt["21"]["inputs"]["text_positive"] = prompt_exempt
    prompt["23"]["inputs"]["seed"] = random.randint(1, 99999999999)
    prompt["18"]["inputs"]["width"] = width
    prompt["18"]["inputs"]["height"] = height
    prompt["21"]["inputs"]["milehigh"] = style
    
    # Prompt kuyruğa alma fonksiyonu
    def queue_prompt(prompt):
        p = {"prompt": prompt, "client_id": client_id}
        data = json.dumps(p).encode('utf-8')
        req = urllib.request.Request("http://{}/prompt".format(server_address), data=data)
        return json.loads(urllib.request.urlopen(req).read())

    def process_image_data(image_data):
        png_data = image_data[8:]
        try:
            image = Image.open(io.BytesIO(png_data))
            return image
        except Exception as e:
            print(f"Error processing image: {str(e)}")
            return None

    # Görüntü alma fonksiyonu
    def get_images(ws, prompt):
        prompt_id = queue_prompt(prompt)['prompt_id']
        output_images = {}
        while True:
            out = ws.recv()
            if isinstance(out, str):
                message = json.loads(out)
                if message['type'] == 'executing':
                    data = message['data']
                    if data['node'] is None and data['prompt_id'] == prompt_id:
                        break
            elif isinstance(out, bytes):
                output_images[prompt_id] = out
        return output_images

    # WebSocket bağlantısı ve görüntü işleme
    ws = websocket.WebSocket()
    ws.connect("ws://{}/ws?clientId={}".format(server_address, client_id))
    images = get_images(ws, prompt)

    output_images = []
    for prompt_id, image_data in images.items():
        image = process_image_data(image_data)
        if image:
            buffered = io.BytesIO()
            image.save(buffered, format="PNG")
            img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')
            img_url = f"data:image/png;base64,{img_str}"
            output_images.append(img_url)
    
    return output_images

@csrf_protect
@api_view(['POST'])
def generate_image(request):
    prompt = request.data.get('prompt', 'Default prompt text')
    height = int(request.data.get('height', 1024))
    width = int(request.data.get('width', 1024))
    style = request.data.get('style', '')
    print(prompt)

    try:
        images = process_prompt(prompt, height, width, style)
        return JsonResponse({'images': images})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)