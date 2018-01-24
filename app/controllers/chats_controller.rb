class ChatsController < ApplicationController
  before_action :authenticate_user!

  def index
  end

  def messages
    render json: Message.between(current_user.id, params[:id])
  end

  def users
    render json: User.all_except(current_user).map{ |user| { name: user.name, id: user.id , online: user.online, last_seen_at: user.updated_at} }
  end

  def counter
    render json: current_user.send_messages_to.count
  end
end
