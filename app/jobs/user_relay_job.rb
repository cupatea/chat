class UserRelayJob < ApplicationJob
  queue_as :default

  def perform(user)
    ActionCable.server.broadcast "users", { name: user.name, id: user.id , online: user.online, last_seen_at: user.updated_at }
  end
end
