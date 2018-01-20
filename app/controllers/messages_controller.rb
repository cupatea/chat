class MessagesController < ApplicationController
  before_action :authenticate_user!

  def create
    message = Message.new _permitter_message_params
    message.addresser_id = current_user.id
    message.save
    MessageRelayJob.perform_later(message)
  end

  private
    def _permitter_message_params
      params.require(:message).permit(:body, :addressee_id)
    end
end
