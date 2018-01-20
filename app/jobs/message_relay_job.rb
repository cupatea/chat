class MessageRelayJob < ApplicationJob
  queue_as :default

  def perform(message)
    ActionCable.server.broadcast "stream:#{message.addressee.id}-#{message.addresser.id}", message
  end
end
