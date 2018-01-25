class UserRelayJob < ApplicationJob
  queue_as :default
  # Broadcast specific information about user to the 'users' stream. This job suppose to be executed in a case of any updates connected with user.
  # E.g. user become online or offline
  def perform(user)
    ActionCable.server.broadcast "users", { name: user.name, id: user.id , online: user.online, last_seen_at: user.updated_at }
  end
end
