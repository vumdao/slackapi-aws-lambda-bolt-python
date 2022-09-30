import time
import logging


from slack_bolt import App
from slack_bolt.adapter.aws_lambda import SlackRequestHandler

# process_before_response must be True when running on FaaS
app = App(process_before_response=True)


@app.event("app_mention")
def handle_app_mentions(body, say, logger):
    logger.info(body)
    say("What's up?")


@app.middleware  # or app.use(log_request)
def log_request(logger, body, next):
    logger.info(f"Enter middleware with body {body}")
    logger.debug(body)
    return next()


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


def process_request(respond, say, body):
    time.sleep(3)
    title = body["text"]
    user_id = body["user_id"]
    channel_id = body["channel_id"]
    say(f"<@{user_id}> called command in channel {channel_id}")
    respond(f"Completed! (task: {title})")


app.command(command)(ack=respond_to_slack_within_3_seconds, lazy=[process_request])

SlackRequestHandler.clear_all_log_handlers()
logging.basicConfig(format="%(asctime)s %(message)s", level=logging.DEBUG)


def handler(event, context):
    slack_handler = SlackRequestHandler(app=app)
    return slack_handler.handle(event, context)
