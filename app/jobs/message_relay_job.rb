class MessageRelayJob < ApplicationJob
  queue_as :default

  def perform(message)
    ActionCable.server.broadcast "stream:#{message.addressee.id}-#{message.addresser.id}", {
      message: MessagesController.render(message),
      addresser_id: message.addresser_id,
      addressee_id:  message.addressee_id
    }
  end
end
