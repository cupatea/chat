class MessageRelayJob < ApplicationJob
  queue_as :default

  def perform(message)
    ActionCable.server.broadcast "messages:#{message.addressee.id}-#{message.addresser.id}", message
  end
end
