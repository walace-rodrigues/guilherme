# app/services/send_whatsapp_local.py
import pywhatkit
import datetime
import time

def send_whatsapp_message(phone_number, message):
    """Envia mensagem via WhatsApp Web usando pywhatkit."""
    try:
        now = datetime.datetime.now()
        hora = now.hour
        minuto = now.minute + 2  # Dá tempo de abrir o navegador e carregar

        print(f"Enviando mensagem para {phone_number} às {hora}:{minuto}")
        pywhatkit.sendwhatmsg(f"+{phone_number}", message, hora, minuto, wait_time=10, tab_close=True)
        time.sleep(15)  # Aguarda envio e fechamento da aba
        print("✅ Mensagem enviada com sucesso.")
    except Exception as e:
        print(f"❌ Erro ao enviar mensagem: {e}")