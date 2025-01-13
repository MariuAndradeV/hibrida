import google.generativeai as genai
import os

GOOGLE_API_KEY=os.getenv('GOOGLE_API_KEY')
genai.configure(api_key="AIzaSyAl3uj5uNGujqy_W7vCHQC42X-rRLvzb-M")

def crearMensaje(text):
    try:
        # Create the model
        generation_config = {
        "temperature": 0.9,
        "top_p": 1,
        "max_output_tokens": 2048,
        "response_mime_type": "text/plain",
        }

        model = genai.GenerativeModel(
        model_name="gemini-pro",
        generation_config=generation_config,
        )

        chat_session = model.start_chat(
        history=[
            {
            "role": "user",
            "parts": [
                f"Eres un chef profesional dame una receta que incluya estos ingredientes: {text}. Si algún ingrediente esta en ingles, tradúcelo en español. El formato que quiero es el siguiente:\n\nPrimero, el nombre de la receta. Segundo, lista de los ingrediente (incluyendo los que te indique). Tecero, pasos para hacer la receta.\n\nSolo pon lo que te indique, no des recomendaciones ni nada mas. Y de preferencia, dame una receta ecuatoriana, es decir, de Ecuador",
            ],
            }
        ]
        )

        response = chat_session.send_message("INSERT_INPUT_HERE")

        print(response.text)
        return False

    except Exception as ex:
        #with st.spinner("Por favor espere unos segundos..."):
        #    time.sleep(20)
        print(ex)
        return True
    
crearMensaje("Pollo, Platano Verde, Tomate"); 