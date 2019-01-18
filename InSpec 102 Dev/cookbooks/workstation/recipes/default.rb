#
# Cookbook:: workstation
# Recipe:: default
#
# Copyright:: 2019, The Authors, All Rights Reserved.

execute 'Update and download dependencies' do
  command 'apt-get update && apt-get install -y curl tree emacs nano vim jq ssh git sshpass'
end

execute 'Install latest version of InSpec' do
  command 'curl https://omnitruck.chef.io/install.sh | bash -s -- -P inspec'
end
