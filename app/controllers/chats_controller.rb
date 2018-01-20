class ChatsController < ApplicationController
  before_action :authenticate_user!


  def index
    @users = User.all - [ current_user ]
    @messages_count = current_user.has_messages_from.count
  end

  def show
    @addressee = User.find_by_id params[:id]
    @new_message =  Message.new addressee_id: @addressee.id
    redirect_to chats_path unless @addressee
  end

  def messages
    render json: Message.between(current_user.id, params[:id])
  end
end
