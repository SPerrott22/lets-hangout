FROM python:3.6-slim-buster

WORKDIR /app

RUN apt-get update && apt-get install -y netcat && rm -rf /var/lib/lists/*

COPY requirements.txt ./

RUN pip3 install -r requirements.txt

COPY . .

RUN chmod +x ./entrypoint.sh

EXPOSE 4000

ENTRYPOINT ["./entrypoint.sh"]

CMD ["flask", "run", "--host=0.0.0.0", "--port=4000"]