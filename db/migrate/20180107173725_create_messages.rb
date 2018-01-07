class CreateMessages < ActiveRecord::Migration[5.1]
  def change
    create_table :messages do |t|
      t.references :addressee
      t.references :addresser
      t.text :body

      t.timestamps
    end
  end
end
