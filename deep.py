import requests

url = 'http://127.0.0.1:5000/search'
params = {"q": "Angela White"}

content = requests.get(url=url, params=params)

if content.status_code == 200:
    content = content.json()
    print(content)

else:
    print("Failed To Show the Result")

