FROM python:3.8-slim-buster

RUN apt-get update && apt-get install -y netcat libpq-dev && rm -rf /var/lib/lists/*

COPY requirements.txt ./

RUN pip3 install -r requirements.txt

COPY . .

RUN chmod +x ./entrypoint.sh

EXPOSE 4000

ENTRYPOINT ["./entrypoint.sh"]

CMD ["flask", "run", "--host=0.0.0.0", "--port=4000"]