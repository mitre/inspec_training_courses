#
# Cookbook:: target-centos6
# Recipe:: default
#
# Copyright:: 2019, The Authors, All Rights Reserved.

execute 'Update and download dependencies' do
  command 'yum update -y && yum install -y openssh-server'
end

execute 'Start SSH' do
  command '/sbin/service sshd start'
end
