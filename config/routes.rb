Rails.application.routes.draw do
  root to: 'chats#index'
  devise_for :users
  resources :chats, only: [:index, :show] do
    member do
      get :messages
      get :users
      get :counter
    end
  end
  resources :messages, only: [:create]
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
