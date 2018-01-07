class Message < ApplicationRecord
  belongs_to :addressee, class_name: 'User'
  belongs_to :addresser, class_name: 'User'

end
