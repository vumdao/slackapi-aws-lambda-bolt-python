import time
import logging
from slack_bolt import App
from slack_bolt.adapter.aws_lambda import SlackRequestHandler

# process_before_response must be True when running on FaaS
app = App(process_before_response=True)


command = "/hello-bolt-python-lambda"


def respond_to_slack_within_3_seconds(body, ack):
  try:
    if body.get("text") is None:
        ack(f":x: Usage: {command} (description here)")
    else:
        title = body["text"]
        ack(f"Accepted! (task: {title})")
  except Exception as err:
    ack(f"Something went wrong with error {err}")


def process_request(context, respond, say, body):
    time.sleep(3)
    title = body["text"]
    say(f"<@{context.user_id}> called command in channel {context.channel_id}")
    respond(f"Completed! (task: {title})")


app.command(command)(ack=respond_to_slack_within_3_seconds, lazy=[process_request])

SlackRequestHandler.clear_all_log_handlers()
logging.basicConfig(format="%(asctime)s %(message)s", level=logging.DEBUG)


def handler(event, context):
    slack_handler = SlackRequestHandler(app=app)
    return slack_handler.handle(event, context)
