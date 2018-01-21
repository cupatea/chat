class MessagesChannel < ApplicationCable::Channel
  def subscribed
    User.all_except(current_user).each do |user|
      stream_from "messages:#{current_user.id}-#{user.id}"
      stream_from "messages:#{user.id}-#{current_user.id}"
    end
  end

  def unsubscribed
    stop_all_streams
  end
end
