App.messages = App.cable.subscriptions.create "MessagesChannel",
  connected: ->
    # Called when the subscription is ready for use on the server

  disconnected: ->
    # Called when the subscription has been terminated by the server

  received: (data) ->
    active_addresser_stream = document.getElementById("stream:#{data.addresser_id}-#{data.addressee_id}")
    active_addressee_stream = document.getElementById("stream:#{data.addressee_id}-#{data.addresser_id}")
    if active_addresser_stream
      active_addresser_stream.insertAdjacentHTML('beforeend', data.message)
    if active_addressee_stream
      active_addressee_stream.insertAdjacentHTML('beforeend', data.message)
