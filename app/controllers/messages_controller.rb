class MessagesController < ApplicationController
  before_action :authenticate_user!

  def create
    message = Message.new _permitter_message_params
    message.addresser = current_user
    message.save
  end

  private
    def _permitter_message_params
      params.require(:message).permit(:body, :addressee_id)
    end
end
