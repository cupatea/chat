class ChatsController < ApplicationController
  before_action :authenticate_user!

  def index
    @users = User.all - [ current_user ]
  end

  def show
    redirect_to chats_path unless @addressee = User.find_by_id(params[:id])
    @messages = Message.between(current_user.id, @addressee.id)
    @new_message =  Message.new addressee_id: @addressee.id
  end
end
