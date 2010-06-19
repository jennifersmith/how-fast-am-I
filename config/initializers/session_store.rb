# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_how-fast-am-I_session',
  :secret      => 'c9287e0215f13a26d4fd65ada1d553e4b6ccbc5ce7413a96011638625c4c1c8c8258ec80e3b4a6b7537484041f14dca8f58afa0562404c93ce5c5e47eccd4f91'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
