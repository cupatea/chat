class Message < ApplicationRecord
  belongs_to :addressee, class_name: 'User'
  belongs_to :addresser, class_name: 'User'

  def self.between(first_id, second_id)
    where(addressee_id: first_id, addresser_id: second_id)
    .or(where(addressee_id: second_id, addresser_id: first_id))
    .includes(:addresser)
    .order(:created_at)
  end
end
