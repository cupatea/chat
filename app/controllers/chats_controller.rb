class ChatsController < ApplicationController
  before_action :authenticate_user!

  def index
    @users = User.all_except current_user
    @messages_count = current_user.has_messages_from.count
  end

  def show
    redirect_to chats_path unless User.exists? id: params[:id]
  end

  def messages
    render json: Message.between(current_user.id, params[:id])
  end

  def users
    render json: User.all_except(current_user).map{ |user| { name: user.name, id: user.id } }
  end

  def counter
    render json: current_user.send_messages_to.count
  end
end
