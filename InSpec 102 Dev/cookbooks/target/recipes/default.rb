#
# Cookbook:: target
# Recipe:: default
#
# Copyright:: 2019, The Authors, All Rights Reserved.

execute 'Update and download dependencies' do
  command 'apt-get update && apt-get install -y openssh-server nginx'
end

execute 'Create root account' do
  command "echo 'root:password' | chpasswd"
end

execute 'Permit Root Login' do
  command "sed -i 's/PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config"
end

execute 'Pam Loginuid' do
  command "sed 's@session\\s*required\\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd"
end
