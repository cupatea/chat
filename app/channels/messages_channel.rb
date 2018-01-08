class MessagesChannel < ApplicationCable::Channel
  def subscribed
    (User.ids - [current_user.id]).each do |user_id|
      stream_from "stream:#{current_user.id}-#{user_id}"
      stream_from "stream:#{user_id}-#{current_user.id}"
    end
  end

  def unsubscribed
    stop_all_streams
  end
end
