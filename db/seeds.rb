require 'faker'

#Generate Users
next_id = User.count > 0 ? User.last.id + 1 : 0
10.times do |index|
  User.create(
    name: Faker::StarWars.character,
    email: "test#{next_id + index}@mail.com",
    password: '123456'
  )
end

#Generate messages
ids = User.ids
1000.times do |index|
  addresser_id = ids.sample
  Message.create!(
    addresser_id: addresser_id,
    addressee_id: (ids - [addresser_id]).sample,
    body: Faker::StarWars.quote
  )
end
