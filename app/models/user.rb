class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  has_many :sended_messages,   class_name: 'Message', foreign_key: :addresser_id
  has_many :received_messages, class_name: 'Message', foreign_key: :addressee_id

  def has_messages_from
    received_messages.group(:addresser_id)
  end

end
