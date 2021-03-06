class MessagesChannel < ApplicationCable::Channel
  def subscribed
    current_user.update online: true
    UserRelayJob.perform_later(current_user)
    User.all_except(current_user).each do |user|
      stream_from "messages:#{current_user.id}-#{user.id}"
      stream_from "messages:#{user.id}-#{current_user.id}"
    end
  end

  def unsubscribed
    current_user.update online: false
    UserRelayJob.perform_later(current_user)
    stop_all_streams
  end
end
