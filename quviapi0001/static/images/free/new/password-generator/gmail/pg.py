import random
import string
import datetime

def generate_password(length=12):
    characters = string.ascii_letters + string.digits + string.punctuation
    password = ''.join(random.choice(characters) for i in range(length))
    return password

def save_password_to_file(password):
    with open("passwords.txt", "a") as file:
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        file.write(f"{timestamp} {password}\n")

def main():
    password_length = int(input("Şifre uzunluğunu girin: "))
    password = generate_password(password_length)
    print("Oluşturulan Şifre:", password)
    
    save_password_to_file(password)
    print("Şifre başarıyla dosyaya kaydedildi.")

if __name__ == "__main__":
    main()
