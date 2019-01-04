# InSpec Developer 102

## 1. Set up your environment

In this module, you'll use a set of Docker images that we've created for you.

From your terminal or PowerShell prompt, start by moving to the ~/learn-inspec directory.

`$ cd ~/learn-inspec`

Next, get the Docker Compose file. Run the command that matches your system to download a file named `docker-compose-nginx.yml`.

**Windows:**

```$ Invoke-WebRequest -useb -o docker-compose-nginx.yml https://raw.githubusercontent.com/learn-chef/inspec/master/docker-compose-nginx.yml```

**Mac:**

```curl -o docker-compose-nginx.yml -s https://raw.githubusercontent.com/learn-chef/inspec/master/docker-compose-nginx.yml```

**Linux:**

```$ wget -O docker-compose-nginx.yml https://raw.githubusercontent.com/learn-chef/inspec/master/docker-compose-nginx.yml```

Next, run the following `docker-compose` command to retrieve the latest workstation images.

```$ docker-compose -f docker-compose-nginx.yml pull```

Next, run the following `docker-compose` command to start the containers. The `-d` argument starts the containers in the background.

```$ docker-compose -f docker-compose-nginx.yml up -d```

Now that your containers are running in the background, run this command to start an interactive Bash session on the workstation container.

```$ docker exec -it workstation bash```

We will need to update the version of InSpec that is on the docker image to the latest version of InSpec, run this command in the bash session.

```$ curl https://omnitruck.chef.io/install.sh | bash -s -- -P inspec```

The workstation can connect to the target by the target's name, target. Run curl target and you see that NGINX is running.

```
$ curl target

<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
    body {
        width: 35em;
        margin: 0 auto;
        font-family: Tahoma, Verdana, Arial, sans-serif;
    }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>
```

Throughout the module, you'll add code to an InSpec profile. The Docker installation mounts the `/root` directory on the workstation container to the directory where you ran `docker-compose` (here, we use `~/learn-inspec`). Therefore, you can use `emacs`, `nano`, or `vim` to edit files directly from the workstation container or you can modify the files using a graphical text editor from your host workstation.

Also, because the `/root` directory is mounted to your host workstation, the InSpec profile you create will continue to exist on your workstation after you destroy your Docker containers.

## 2. Create the my_nginx profile

Let's start by creating a profile that will contain NGINX tests.

Start by moving to the /root directory.

```$ cd /root```

Next, create an InSpec profile named my_nginx.

```
$ inspec init profile my_nginx
Create new profile at /root/my_nginx
 * Create directory controls
 * Create file controls/example.rb
 * Create file inspec.yml
 * Create directory libraries
 * Create file README.md
```

## 3. Understand the profile's structure

Let's take a look at how the profile is structured. We'll start with how a profile's files are structured and then move to what makes up an InSpec control.

### Understand the file structure

First, run `tree` to see what's in the `my_nginx` profile.

```
$ tree my_nginx
      my_nginx
      ├── README.md
      ├── controls
      │   └── example.rb
      ├── inspec.yml
      └── libraries

      2 directories, 3 files
```

Here's the role of each component.

* `README.md` provides documentation about the profile, including what it covers and how to run it.
* The `controls` directory contains files which implement the InSpec tests.
* `inspec.yml` provides metadata, or information, about the profile. Metadata includes the profile's description, author, copyright, and version.
* The `libraries` directory contains resource extensions. A resource extension enables you to [define your own resource types](https://www.inspec.io/docs/reference/dsl_resource/). You won't work with resource extensions in this module.

[Learn more](https://www.inspec.io/docs/reference/profiles/) about a profile's structure.

### Understand a control's structure

Let's take a look at the default control file, `controls/example.rb`.

```ruby
# encoding: utf-8
# copyright: 2018, The Authors

title 'sample section'

# you can also use plain tests
describe file('/tmp') do
  it { should be_directory }
end

# you add controls here
control 'tmp-1.0' do                        # A unique ID for this control
  impact 0.7                                # The criticality, if this control fails.
  title 'Create /tmp directory'             # A human-readable title
  desc 'An optional description...'
  describe file('/tmp') do                  # The actual test
    it { should be_directory }
  end
end
```

This example shows two tests. Both tests check for the existence of the `/tmp` directory. The second test provides additional information about the test. Let's break down each component.

* `control` (line 12) is followed by the control's name. Each control in a profile has a unique name.
* `impact` (line 13) measures the relative importance of the test and must be a value between 0.0 and 1.0.
* `title` (line 14) defines the control's purpose.
* `desc` (line 15) provides a more complete description of what the control checks for.
* `describe` (lines 16 — 18) defines the test. Here, the test checks for the existence of the `/tmp` directory.

[Learn more](https://www.inspec.io/docs/reference/dsl_inspec/) about the InSpec language.

In Ruby, the `do` and `end` keywords define a [block](http://ruby-for-beginners.rubymonstas.org/blocks.html). An InSpec control always contains at least one `describe` block. However, a control can contain many `describe` blocks.

### Understand a describe block's structure

As with many test frameworks, InSpec code resembles natural language. Here's the format of a describe block.

```ruby
describe <entity> do
  it { <expectation> }
end
```

An InSpec test has two main components: the subject to examine and the subject's expected state. Here, `<entity>` is the subject you want to examine, for example, a package name, service, file, or network port. The `<expectation>` part specifies the desired result or expected state, for example, that a port should be open (or perhaps should not be open.)

Let's take a closer look at the `describe` block in the example.

```ruby
describe file('/tmp') do
  it { should be_directory }
end
```

Because InSpec resembles human-readable language, you might read this test as "/tmp should be a directory." Let's break down each component.

#### file

[file](https://www.inspec.io/docs/reference/resources/file/) is an InSpec [resource](https://www.inspec.io/docs/reference/resources/). If you're familiar with Chef, you know that a resource configures one part of the system. InSpec resources are similar. For example, the InSpec file resource tests for file attributes, including a file's owner, mode, and permissions. The example examines the /tmp directory.

#### it

The `it` statement validates one of your resource's features. A `describe` block contains one or more `it` statements. `it` enables you to test the resource itself. You'll also see `its`, which describes some feature of the resource, such as its mode or owner. You'll see examples of both `it` and `its` shortly.

#### should

`should` describes the expectation. `should` asserts that the condition that follows _should_ be true. Alternatively, `should_not` asserts that the condition that follows _should not_ be true. You'll see examples of both shortly.

#### be_directory

`be_directory` is an example of a [matcher](https://www.inspec.io/docs/reference/matchers/). A matcher compares a resource's actual value to its expected value. InSpec provides several predefined matchers. The `file` resource provides the `be_directory` matcher.

## 4. Explore resources with InSpec shell

Before we test our NGINX configuration, let's plan which resources and matchers we'll need.

When writing InSpec code, many resources are available to you.

* You can [explore the InSpec documentation](https://www.inspec.io/docs/) to see which resources and matchers are available.
* You can [examine the source code](https://github.com/inspec/inspec) to see what's available. For example, you can see how file and other InSpec resources are implemented.
* You can also use examples, such as profiles provided on [Chef Supermarket](https://supermarket.chef.io/tools-directory), as a guide.

There's also [InSpec shell](https://www.inspec.io/docs/reference/shell/), which enables you to explore InSpec interactively. In this part, you'll use the InSpec shell to discover which resources you can use to test your NGINX configuration.

You're not required to use InSpec shell to develop your profiles. Some users find the InSpec shell to be a useful way to get immediate feedback and explore what's available. You can also use InSpec shell to debug your profiles.

### Enter the shell

Run `inspec shell` to enter the interactive session.

```
$ inspec shell
Welcome to the interactive InSpec Shell
To find out how to use it, type: help

You are currently running on:

    Name:      ubuntu
    Families:  debian, linux, unix
    Release:   16.04
    Arch:      x86_64
```

Run `help` to see what commands are available.

```
inspec> help
    You are currently running on:

        Name:      ubuntu
        Families:  debian, linux, unix
        Release:   16.04
        Arch:      x86_64

    Available commands:

        `[resource]` - run resource on target machine
        `help resources` - show all available resources that can be used as commands
        `help [resource]` - information about a specific resource
        `help matchers` - show information about common matchers
        `exit` - exit the InSpec shell

    You can use resources in this environment to test the target machine. For example:

        command('uname -a').stdout
        file('/proc/cpuinfo').content => "value"
```

Run `help resources` to see which resources are available.

```
inspec> help resources
         - aide_conf
         - apache
         - apache_conf
         - apt
         - audit_policy
         - auditd
         - auditd_conf
         - aws_cloudtrail_trail
         - aws_cloudtrail_trails
         - aws_cloudwatch_alarm
         - aws_cloudwatch_log_metric_filter
         - aws_ec2_instance
         - aws_iam_access_key
         - aws_iam_access_keys
         - aws_iam_group
         - aws_iam_groups
         - aws_iam_password_policy
         - aws_iam_policies
         - aws_iam_policy
         - aws_iam_role
         - aws_iam_root_user
         - aws_iam_user
         - aws_iam_users
         - aws_kms_keys
         - aws_route_table
         - aws_s3_bucket
         - aws_security_group
         - aws_security_groups
         - aws_sns_topic
         - aws_subnet
         - aws_subnets
         - aws_vpc
         - aws_vpcs
         - azure_generic_resource
         - azure_resource_group
         - azure_virtual_machine
         - azure_virtual_machine_data_disk
         - bash
         - bond
         - bridge
         - bsd_service
         - command
         - cpan
         - cran
         - crontab
         - csv
         - dh_params
         - directory
         - docker
         - docker_container
         - docker_image
         - docker_service
         - elasticsearch
         - etc_fstab
         - etc_group
         - etc_hosts
         - etc_hosts_allow
         - etc_hosts_deny
         - file
         - filesystem
         - firewalld
         - gem
         - group
         - groups
         - grub_conf
         - host
         - http
         - iis_app
         - iis_site
         - iis_website
         - inetd_conf
         - ini
         - interface
         - iptables
         - json
         - kernel_module
         - kernel_parameter
         - key_rsa
         - launchd_service
         - limits_conf
         - linux_kernel_parameter
         - login_defs
         - mount
         - mssql_session
         - mysql
         - mysql_conf
         - mysql_session
         - nginx
         - nginx_conf
         - npm
         - ntp_conf
         - oneget
         - oracledb_session
         - os
         - os_env
         - package
         - packages
         - parse_config
         - parse_config_file
         - passwd
         - pip
         - platform
         - port
         - postgres
         - postgres_conf
         - postgres_hba_conf
         - postgres_ident_conf
         - postgres_session
         - powershell
         - ppa
         - processes
         - rabbitmq_config
         - registry_key
         - runit_service
         - script
         - security_policy
         - service
         - shadow
         - ssh_config
         - sshd_config
         - ssl
         - sys_info
         - systemd_service
         - sysv_service
         - toml
         - upstart_service
         - user
         - users
         - vbscript
         - virtualization
         - windows_feature
         - windows_hotfix
         - windows_registry_key
         - windows_task
         - wmi
         - x509_certificate
         - xinetd_conf
         - xml
         - yaml
         - yum
         - yumrepo
         - zfs_dataset
         - zfs_pool

```

You see `file` and other resources listed.

### Explore the file resource

Earlier, you saw this `describe` block.

```ruby
describe file('/tmp') do                  # The actual test
  it { should be_directory }
end
```

Let's run a few commands from the InSpec shell to see how the `file` resource works.

InSpec is built on the Ruby programming language. InSpec matchers are implemented as Ruby methods. Run this command to list which methods are available to the `file` resource.

```
inspec> file('/tmp').class.superclass.instance_methods(false).sort
        => [:allowed?,
         :basename,
         :block_device?,
         :character_device?,
         :contain,
         :content,
         :directory?,
         :executable?,
         :exist?,
         :file,
         :file?,
         :file_version,
         :gid,
         :group,
         :grouped_into?,
         :immutable?,
         :link_path,
         :linked_to?,
         :md5sum,
         :mode,
         :mode?,
         :mount_options,
         :mounted?,
         :mtime,
         :owned_by?,
         :owner,
         :path,
         :pipe?,
         :product_version,
         :readable?,
         :selinux_label,
         :setgid?,
         :setuid?,
         :sgid,
         :sha256sum,
         :size,
         :socket?,
         :source,
         :source_path,
         :sticky,
         :sticky?,
         :suid,
         :symlink?,
         :to_s,
         :type,
         :uid,
         :version?,
         :writable?]
```

You can use the arrow or Page Up and Page Down keys to scroll through the list. When you're done, press `Q`.

```InSpec shell is based on a tool called pry. If you're not familiar with pry or other REPL tools, later you can check out pry to learn more.```

As an example, call the `file.directory?` method.

```
inspec> file('/tmp').directory?
        => true
```

You see that the `/tmp` directory exists on your workstation container.

InSpec transforms resource methods to matchers. For example, the `file.directory?` method becomes the `be_directory` matcher. The `file.readable?` method becomes the `be_readable` matcher.

The InSpec shell understands the structure of blocks. This enables you to run mutiline code. As an example, run the entire `describe` block like this.

```
inspec> describe file('/tmp') do
inspec>  it { should be_directory }
inspec> end
        Profile: inspec-shell
        Version: (not specified)

          File /tmp
             ✔  should be directory

        Test Summary: 1 successful, 0 failures, 0 skipped
```

In practice, you don't typically run controls interactively, but it's a great way to test out your ideas.

```
A Ruby method that ends in ?, such as directory? is known as a predicate method. The ? syntax is intended to make Ruby code easier to read.

A predicate method typically returns a value that can be evaluated as true or false. In Ruby, false and nil are false; everything else evaluates to true.
```

### Explore the nginx resource

Now's a good time to define the requirements for our NGINX configuration. Let's say that you require:

1. NGINX version 1.10.3 or later.
2. the following NGINX modules to be installed:
   * `http_ssl`
   * `stream_ssl`
   * `mail_ssl`
3. the NGINX configuration file, `/etc/nginx/nginx.conf`, to:
   * be owned by the `root` user and group.
   * not be readable, writeable, or executable by others.

Let's see what resources are available to help define these requirements as InSpec controls.

Run `help resources` a second time. Notice InSpec provides two built-in resources to support NGINX – `nginx` and `nginx_conf`.

```
inspec> help resources
         - aide_conf
         - apache
         - apache_conf
         - apt
         - audit_policy
         - auditd
         - auditd_conf
         - aws_cloudtrail_trail
         - aws_cloudtrail_trails
         - aws_cloudwatch_alarm
         - aws_cloudwatch_log_metric_filter
         - aws_ec2_instance
         - aws_iam_access_key
         - aws_iam_access_keys
         - aws_iam_group
         - aws_iam_groups
         - aws_iam_password_policy
         - aws_iam_policies
         - aws_iam_policy
         - aws_iam_role
         - aws_iam_root_user
         - aws_iam_user
         - aws_iam_users
         - aws_kms_keys
         - aws_route_table
         - aws_s3_bucket
         - aws_security_group
         - aws_security_groups
         - aws_sns_topic
         - aws_subnet
         - aws_subnets
         - aws_vpc
         - aws_vpcs
         - azure_generic_resource
         - azure_resource_group
         - azure_virtual_machine
         - azure_virtual_machine_data_disk
         - bash
         - bond
         - bridge
         - bsd_service
         - command
         - cpan
         - cran
         - crontab
         - csv
         - dh_params
         - directory
         - docker
         - docker_container
         - docker_image
         - docker_service
         - elasticsearch
         - etc_fstab
         - etc_group
         - etc_hosts
         - etc_hosts_allow
         - etc_hosts_deny
         - file
         - filesystem
         - firewalld
         - gem
         - group
         - groups
         - grub_conf
         - host
         - http
         - iis_app
         - iis_site
         - iis_website
         - inetd_conf
         - ini
         - interface
         - iptables
         - json
         - kernel_module
         - kernel_parameter
         - key_rsa
         - launchd_service
         - limits_conf
         - linux_kernel_parameter
         - login_defs
         - mount
         - mssql_session
         - mysql
         - mysql_conf
         - mysql_session
         - nginx
         - nginx_conf
         - npm
         - ntp_conf
         - oneget
         - oracledb_session
         - os
         - os_env
         - package
         - packages
         - parse_config
         - parse_config_file
         - passwd
         - pip
         - platform
         - port
         - postgres
         - postgres_conf
         - postgres_hba_conf
         - postgres_ident_conf
         - postgres_session
         - powershell
         - ppa
         - processes
         - rabbitmq_config
         - registry_key
         - runit_service
         - script
         - security_policy
         - service
         - shadow
         - ssh_config
         - sshd_config
         - ssl
         - sys_info
         - systemd_service
         - sysv_service
         - toml
         - upstart_service
         - user
         - users
         - vbscript
         - virtualization
         - windows_feature
         - windows_hotfix
         - windows_registry_key
         - windows_task
         - wmi
         - x509_certificate
         - xinetd_conf
         - xml
         - yaml
         - yum
         - yumrepo
         - zfs_dataset
         - zfs_pool
```

Run `nginx.methods`. You see the `version` and `modules` methods. You'll use these methods to define the first two requirements.

```
inspec> nginx.class.superclass.instance_methods(false).sort
        => [:bin_dir,
         :compiler_info,
         :error_log_path,
         :http_client_body_temp_path,
         :http_fastcgi_temp_path,
         :http_log_path,
         :http_proxy_temp_path,
         :http_scgi_temp_path,
         :http_uwsgi_temp_path,
         :lock_path,
         :modules,
         :modules_path,
         :openssl_version,
         :params,
         :prefix,
         :sbin_path,
         :service,
         :support_info,
         :to_s,
         :version]
```

Run `nginx.version` to see what result you get.

```
inspec> nginx.version
        NoMethodError: undefined method `[]' for nil:NilClass
        from /opt/inspec/embedded/lib/ruby/gems/2.4.0/gems/inspec-2.0.17/lib/resources/nginx.rb:39:in `block (2 levels) in <class:Nginx>'
```

Notice the error. This tells us that NGINX is not installed. Recall that you're working on your workstation container environment, which does not have NGINX installed. Run the following [package](https://www.inspec.io/docs/reference/resources/package/) resource to verify.

```
inspec> package('nginx').installed?
        => false
```

Although you've discovered the methods you need – `version` and `modules` – let's run InSpec shell commands against the target that does have NGINX installed to see what results we find. To do so, first start by exiting your InSpec shell session.

```
inspec> exit
```

Run `inspec shell` a second time. This time, provide the `-t` argument to connect the shell session to the target container. This is similar to how you ran `inspec exec` in the [Try InSpec](https://learn.chef.io/modules/try-inspec#/step4.3) module to scan the target from the workstation.

```
$ inspec shell -t ssh://root:password@target
  Welcome to the interactive InSpec Shell
  To find out how to use it, type: help

  You are currently running on:

      Name:      ubuntu
      Families:  debian, linux, unix
      Release:   16.04
      Arch:      x86_64
```

Remember that the target does not have the InSpec CLI installed on it. Your shell session exists on the workstation container; InSpec routes commands to the target instance over SSH.

Run the `package` resource a second time, this time on the target container.

```
inspec> package('nginx').installed?
        => true
```

You see that NGINX is installed. Now run `nginx.version`.

```
inspec> nginx.version
        => "1.10.3"
```

You see that version 1.10.3 is installed. To complete the example, run `nginx.modules` to list the installed NGINX modules.

```
inspec> nginx.modules
        => ["http_ssl",
         "http_stub_status",
         "http_realip",
         "http_auth_request",
         "http_addition",
         "http_dav",
         "http_geoip",
         "http_gunzip",
         "http_gzip_static",
         "http_image_filter",
         "http_v2",
         "http_sub",
         "http_xslt",
         "stream_ssl",
         "mail_ssl"]
```

You see that the required modules, `http_ssl`, `stream_ssl`, and `mail_ssl`, are installed.

The [nginx_conf](https://www.inspec.io/docs/reference/resources/nginx_conf/) resource examines the contents of the NGINX configuration file, `/etc/nginx/nginx.conf`.

Recall that the third requirement is to check whether the NGINX configuration file is owned by `root` and is not readable, writeable, or executable by others. Because we want to test attributes of the file itself, and not its contents, you'll use the `file` resource.

You saw earlier how the `file` resource provides the `readable`, `writeable`, and `executable` methods. You would also see that the `file` resource provides the `owned_by` and `grouped_into` methods.

```
inspec> file('/tmp').class.superclass.instance_methods(false).sort
        => [:allowed?,
         :basename,
         :block_device?,
         :character_device?,
         :contain,
         :content,
         :directory?,
         :executable?,
         :exist?,
         :file,
         :file?,
         :file_version,
         :gid,
         :group,
         :grouped_into?,
         :immutable?,
         :link_path,
         :linked_to?,
         :md5sum,
         :mode,
         :mode?,
         :mount_options,
         :mounted?,
         :mtime,
         :owned_by?,
         :owner,
         :path,
         :pipe?,
         :product_version,
         :readable?,
         :selinux_label,
         :setgid?,
         :setuid?,
         :sgid,
         :sha256sum,
         :size,
         :socket?,
         :source,
         :source_path,
         :sticky,
         :sticky?,
         :suid,
         :symlink?,
         :to_s,
         :type,
         :uid,
         :version?,
         :writable?]
```

These 5 `file` methods – `grouped_into`, `executable`, `owned_by`, `readable` and `writeable` – provide everything we need for the third requirement.

Exit the InSpec shell session.

```
inspec> exit
```

## 5. Write the InSpec controls

Now that you understand which methods map to each requirement, you're ready to write InSpec controls.

To review, recall that you require:

1. NGINX version 1.10.3 or later.
2. the following NGINX modules to be installed:
   * `http_ssl`
   * `stream_ssl`
   * `mail_ssl`
3. the NGINX configuration file, `/etc/nginx/nginx.conf`, to:
   * be owned by the `root` user and group.
   * not be readable, writeable, or executable by others.

The first requirement is for the NGINX version to be 1.10.3 or later. To check this, you use the `cmp` matcher. Replace the contents of `/root/my_nginx/controls/example.rb` with this.

```ruby
control 'nginx-version' do
  impact 1.0
  title 'NGINX version'
  desc 'The required version of NGINX should be installed.'
  describe nginx do
    its('version') { should cmp >= '1.10.3' }
  end
end
```

The test has an impact of 1.0, meaning it is most critical. A failure might indicate to the team that this issue should be resolved as soon as possible, likely by upgrading NGINX to a newer version. The test compares `nginx.version` against version 1.10.3.

`cmp` is one of InSpec's [built-in matchers](https://www.inspec.io/docs/reference/matchers/). `cmp` understands version numbers and can use the operators ==, <, <=, >=, and >. `cmp` compares versions by each segment, not as a string. For example, "7.4" is less than than "7.30".

Next, run `inspec exec` to execute the profile on the remote target.

```
$ inspec exec /root/my_nginx -t ssh://root:password@target

  Profile: InSpec Profile (my_nginx)
  Version: 0.1.0
  Target:  ssh://root@target:22

    ✔  nginx-version: NGINX version
       ✔  Nginx Environment version should cmp >= "1.10.3"


  Profile Summary: 1 successful control, 0 control failures, 0 controls skipped
  Test Summary: 1 successful, 0 failures, 0 skipped
```

You see that the test passes.

The second requirement verifies that these modules are installed.

* http_ssl
* stream_ssl
* mail_ssl

Modify your control file like this.

```ruby
control 'nginx-version' do
  impact 1.0
  title 'NGINX version'
  desc 'The required version of NGINX should be installed.'
  describe nginx do
    its('version') { should cmp >= '1.10.3' }
  end
end

control 'nginx-modules' do
  impact 1.0
  title 'NGINX version'
  desc 'The required NGINX modules should be installed.'
  describe nginx do
    its('modules') { should include 'http_ssl' }
    its('modules') { should include 'stream_ssl' }
    its('modules') { should include 'mail_ssl' }
  end
end
```

The second control resembles the first; however, this version uses multiple `its` statements and the `nginx.modules` method. The `nginx.modules` method returns a list; the built-in `include` matcher verifies whether a value belongs to a given list.

Run `inspec exec` on the target.

```
$ inspec exec /root/my_nginx -t ssh://root:password@target

  Profile: InSpec Profile (my_nginx)
  Version: 0.1.0
  Target:  ssh://root@target:22

    ✔  nginx-version: NGINX version
       ✔  Nginx Environment version should cmp >= "1.10.3"
    ✔  nginx-modules: NGINX version
       ✔  Nginx Environment modules should include "http_ssl"
       ✔  Nginx Environment modules should include "stream_ssl"
       ✔  Nginx Environment modules should include "mail_ssl"


  Profile Summary: 2 successful controls, 0 control failures, 0 controls skipped
  Test Summary: 4 successful, 0 failures, 0 skipped
```

This time, both controls pass.

The third requirement verifies that the NGINX configuration file, `/etc/nginx/nginx.conf`:

* is owned by the root user and group.
* is not be readable, writeable, or executable by others.

Modify your control file like this.

```ruby
control 'nginx-version' do
  impact 1.0
  title 'NGINX version'
  desc 'The required version of NGINX should be installed.'
  describe nginx do
    its('version') { should cmp >= '1.10.3' }
  end
end

control 'nginx-modules' do
  impact 1.0
  title 'NGINX version'
  desc 'The required NGINX modules should be installed.'
  describe nginx do
    its('modules') { should include 'http_ssl' }
    its('modules') { should include 'stream_ssl' }
    its('modules') { should include 'mail_ssl' }
  end
end

control 'nginx-conf' do
  impact 1.0
  title 'NGINX configuration'
  desc 'The NGINX config file should owned by root, be writable only by owner, and not writeable or and readable by others.'
  describe file('/etc/nginx/nginx.conf') do
    it { should be_owned_by 'root' }
    it { should be_grouped_into 'root' }
    it { should_not be_readable.by('others') }
    it { should_not be_writable.by('others') }
    it { should_not be_executable.by('others') }
  end
end
```

The third control uses the `file` resource. The first 2 tests use `should` to verify the `root` owner and group. The last 3 tests use `should_not` to verify that the file is not readable, writable, or executable by others.

Run `inspec exec` on the target.

```
$ inspec exec /root/my_nginx -t ssh://root:password@target

  Profile: InSpec Profile (my_nginx)
  Version: 0.1.0
  Target:  ssh://root@target:22

    ✔  nginx-version: NGINX version
       ✔  Nginx Environment version should cmp >= "1.10.3"
    ✔  nginx-modules: NGINX version
       ✔  Nginx Environment modules should include "http_ssl"
       ✔  Nginx Environment modules should include "stream_ssl"
       ✔  Nginx Environment modules should include "mail_ssl"
    ×  nginx-conf: NGINX configuration (1 failed)
       ✔  File /etc/nginx/nginx.conf should be owned by "root"
       ✔  File /etc/nginx/nginx.conf should be grouped into "root"
       ×  File /etc/nginx/nginx.conf should not be readable by others
       expected File /etc/nginx/nginx.conf not to be readable by others
       ✔  File /etc/nginx/nginx.conf should not be writable by others
       ✔  File /etc/nginx/nginx.conf should not be executable by others


  Profile Summary: 2 successful controls, 1 control failure, 0 controls skipped
  Test Summary: 8 successful, 1 failure, 0 skipped
```

This time you see a failure. You discover that `/etc/nginx/nginx.conf` is potentially readable by others. Because this control also has an impact of 1.0, your team may need to investigate further.

Remember, the first step, detect, is where you identify where the problems are so that you can accurately assess risk and prioritize remediation actions. For the second step, correct, you can use Chef or some other continuous automation framework to correct compliance failures for you. You won't correct this issue in this module, but later you can check out the [Integrated Compliance with Chef](https://learn.chef.io/tracks/integrated-compliance#/) track to learn more about how to correct compliance issues using Chef.

## 6. Refactor the code to use a data file

Your `my_nginx` profile is off to a great start. As your requirements evolve, you can add additional controls. You can also run this profile as often as you need to verify whether your systems remain in compliance.

Let's review the control file, `example.rb`.

```ruby
control 'nginx-version' do
  impact 1.0
  title 'NGINX version'
  desc 'The required version of NGINX should be installed.'
  describe nginx do
    its('version') { should cmp >= '1.10.3' }
  end
end

control 'nginx-modules' do
  impact 1.0
  title 'NGINX version'
  desc 'The required NGINX modules should be installed.'
  describe nginx do
    its('modules') { should include 'http_ssl' }
    its('modules') { should include 'stream_ssl' }
    its('modules') { should include 'mail_ssl' }
  end
end

control 'nginx-conf' do
  impact 1.0
  title 'NGINX configuration'
  desc 'The NGINX config file should owned by root, be writable only by owner, and not writeable or and readable by others.'
  describe file('/etc/nginx/nginx.conf') do
    it { should be_owned_by 'root' }
    it { should be_grouped_into 'root' }
    it { should_not be_readable.by('others') }
    it { should_not be_writable.by('others') }
    it { should_not be_executable.by('others') }
  end
end
```

Although these rules do what you expect, imagine your control file contains dozens or hundreds of tests. As the data you check for, such as the version or which modules are installed, evolve, it can become tedious to locate and update your tests. You may also find that you repeat the same data in across multiple control files.

One way to improve these tests is to use a [profile file](https://www.inspec.io/docs/reference/profiles/#profile-files). A profile file enables you to separate the logic of your tests from the data your tests validate. A profile file is typically expressed as a YAML file.

Profile files exist in your profile's `files` directory. Start by creating this directory.

```
$ mkdir -p /root/my_nginx/files
```

Next, create a file named `/root/my_nginx/files/params.yml` and add this content.

```
version: 1.10.3
modules:
  - http_ssl
  - stream_ssl
  - mail_ssl
```

This file defines two elements – `version` and `modules`. `version` contains the string "1.10.3" as its value. `modules` contains a list of each required NGINX module name as its data.

The name `params.yml` is just an example. You can name a profile file whatever you like. You can also have multiple profile files.

Next, modify your control file like this.

```ruby
nginx_params = yaml(content: inspec.profile.file('params.yml')).params

required_version = nginx_params['version']
required_modules = nginx_params['modules']

control 'nginx-version' do
  impact 1.0
  title 'NGINX version'
  desc 'The required version of NGINX should be installed.'
  describe nginx do
    its('version') { should cmp >= required_version }
  end
end

control 'nginx-modules' do
  impact 1.0
  title 'NGINX version'
  desc 'The required NGINX modules should be installed.'
  describe nginx do
    required_modules.each do |required_module|
      its('modules') { should include required_module }
    end
  end
end

control 'nginx-conf' do
  impact 1.0
  title 'NGINX configuration'
  desc 'The NGINX config file should owned by root, be writable only by owner, and not writeable or and readable by others.'
  describe file('/etc/nginx/nginx.conf') do
    it { should be_owned_by 'root' }
    it { should be_grouped_into 'root' }
    it { should_not be_readable.by('others') }
    it { should_not be_writable.by('others') }
    it { should_not be_executable.by('others') }
  end
end
```

Let's review what's changed.

The first line uses the `yaml` method to read in `params.yml` as a Ruby [Hash](https://www.tutorialspoint.com/ruby/ruby_hashes.htm). The `required_version` and `required_modules` variables read the `version` and `modules` elements from the Hash, respectively.

The `nginx-version` control uses the `required_version` variable instead of the hard-coded version string.

The `nginx-modules` control replaces the hard-coded module names with a Ruby [each](https://www.tutorialspoint.com/ruby/ruby_iterators.htm) iterator that reads each required module from the `required_modules` variable.

Run the InSpec tests again to verify you get the same result.

```
$ inspec exec /root/my_nginx -t ssh://root:password@target

  Profile: InSpec Profile (my_nginx)
  Version: 0.1.0
  Target:  ssh://root@target:22

    ✔  nginx-version: NGINX version
       ✔  Nginx Environment version should cmp >= "1.10.3"
    ✔  nginx-modules: NGINX version
       ✔  Nginx Environment modules should include "http_ssl"
       ✔  Nginx Environment modules should include "stream_ssl"
       ✔  Nginx Environment modules should include "mail_ssl"
    ×  nginx-conf: NGINX configuration (1 failed)
       ✔  File /etc/nginx/nginx.conf should be owned by "root"
       ✔  File /etc/nginx/nginx.conf should be grouped into "root"
       ×  File /etc/nginx/nginx.conf should not be readable by others
       expected File /etc/nginx/nginx.conf not to be readable by others
       ✔  File /etc/nginx/nginx.conf should not be writable by others
       ✔  File /etc/nginx/nginx.conf should not be executable by others


  Profile Summary: 2 successful controls, 1 control failure, 0 controls skipped
  Test Summary: 8 successful, 1 failure, 0 skipped
```

As expected, all but one of the tests pass.

Let's say that you now require the NGINX module `http_geoip` to be installed. Modify `params.yml` like this.

```
version: 1.10.3
modules:
  - http_ssl
  - stream_ssl
  - mail_ssl
  - http_geoip
```

Rerun the InSpec tests.

You see that `http_geoip` is installed.

[Profile attributes](https://www.inspec.io/docs/reference/profiles/#profile-attributes) are another way to load data into your control when it runs. Attributes enable you to override default values or define secrets such as usernames and passwords. Attribute files that contain sensitive data are typically not stored in revision control systems such as Git.

## 7. Run the DevSec Nginx Baseline profile

In this module, we use NGINX for learning purposes. If you're interested in NGINX specifically, you may be interested in the [DevSec Nginx Baseline](https://supermarket.chef.io/tools/nginx-baseline) profile on Chef Supermarket. This profile implements many of the tests you wrote in this module.

To execute this profile on your target system, run this `inspec supermarket exec` command.

```
$ inspec supermarket exec dev-sec/nginx-baseline -t ssh://root:password@target
  [2018-05-03T03:07:51+00:00] WARN: URL target https://github.com/dev-sec/nginx-baseline transformed to https://github.com/dev-sec/nginx-baseline/archive/master.tar.gz. Consider using the git fetcher

  Profile: DevSec Nginx Baseline (nginx-baseline)
  Version: 2.1.0
  Target:  ssh://root@target:22

    ✔  nginx-01: Running worker process as non-privileged user
       ✔  User www-data should exist
       ✔  Parse Config File /etc/nginx/nginx.conf user should eq "www-data"
       ✔  Parse Config File /etc/nginx/nginx.conf group should not eq "root"
    ×  nginx-02: Check NGINX config file owner, group and permissions. (1 failed)
       ✔  File /etc/nginx/nginx.conf should be owned by "root"
       ✔  File /etc/nginx/nginx.conf should be grouped into "root"
       ×  File /etc/nginx/nginx.conf should not be readable by others
       expected File /etc/nginx/nginx.conf not to be readable by others
       ✔  File /etc/nginx/nginx.conf should not be writable by others
       ✔  File /etc/nginx/nginx.conf should not be executable by others
    ×  nginx-03: Nginx default files (2 failed)
       ✔  File /etc/nginx/conf.d/default.conf should not be file
       ×  File /etc/nginx/sites-enabled/default should not be file
       expected `File /etc/nginx/sites-enabled/default.file?` to return false, got true
       ✔  File /etc/nginx/nginx.conf should be file
       ×  File /etc/nginx/conf.d/90.hardening.conf should be file
       expected `File /etc/nginx/conf.d/90.hardening.conf.file?` to return true, got false
    ✔  nginx-04: Check for multiple instances
       ✔  Command ps aux | egrep "nginx: master" | egrep -v "grep" | wc -l stdout should match /^1$/
    ×  nginx-05: Disable server_tokens directive
       ×  Parse Config File /etc/nginx/nginx.conf server_tokens should eq "off"

       expected: "off"
            got: nil

       (compared using ==)

    ↺  nginx-06: Prevent buffer overflow attacks (2 failed) (2 skipped)
       ×  Parse Config File /etc/nginx/nginx.conf client_body_buffer_size should eq "1k"

       expected: "1k"
            got: nil

       (compared using ==)

       ×  Parse Config File /etc/nginx/nginx.conf client_max_body_size should eq "1k"

       expected: "1k"
            got: nil

       (compared using ==)

       ↺  Can't find file "/etc/nginx/conf.d/90.hardening.conf"
       ↺  Can't find file "/etc/nginx/conf.d/90.hardening.conf"
    ↺  nginx-07: Control simultaneous connections (2 skipped)
       ↺  Can't find file "/etc/nginx/conf.d/90.hardening.conf"
       ↺  Can't find file "/etc/nginx/conf.d/90.hardening.conf"
    ↺  nginx-08: Prevent clickjacking
       ↺  Can't find file "/etc/nginx/conf.d/90.hardening.conf"
    ↺  nginx-09: Enable Cross-site scripting filter
       ↺  Can't find file "/etc/nginx/conf.d/90.hardening.conf"
    ↺  nginx-10: Disable content-type sniffing
       ↺  Can't find file "/etc/nginx/conf.d/90.hardening.conf"
    ↺  nginx-11: Disable content-type sniffing
       ↺  Can't find file "/etc/nginx/conf.d/90.hardening.conf"
    ×  nginx-12: TLS Protocols (5 failed)
       ×  File /etc/nginx/conf.d/90.hardening.conf content should match /^\s*ssl_protocols TLSv1.2;$/
       expected nil to match /^\s*ssl_protocols TLSv1.2;$/
       ×  File /etc/nginx/conf.d/90.hardening.conf content should match /^\s*ssl_session_tickets off;$/
       expected nil to match /^\s*ssl_session_tickets off;$/
       ×  File /etc/nginx/conf.d/90.hardening.conf content should match /^\s*ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256';$/
       expected nil to match /^\s*ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256';$/
       ×  File /etc/nginx/conf.d/90.hardening.conf content should match /^\s*ssl_prefer_server_ciphers on;$/
       expected nil to match /^\s*ssl_prefer_server_ciphers on;$/
       ×  File /etc/nginx/conf.d/90.hardening.conf content should match /^\s*ssl_dhparam \/etc\/nginx\/dh2048.pem;$/
       expected nil to match /^\s*ssl_dhparam \/etc\/nginx\/dh2048.pem;$/
    ×  nginx-13: Add HSTS Header
       ×  File /etc/nginx/conf.d/90.hardening.conf content should match /^\s*add_header Strict-Transport-Security max-age=15768000;$/
       expected nil to match /^\s*add_header Strict-Transport-Security max-age=15768000;$/
    ×  nginx-14: Disable insecure HTTP-methods
       ×  File /etc/nginx/nginx.conf content should match /^\s*if\s+\(\$request_method\s+\!\~\s+\^\(GET\|HEAD\|POST\)\$\)\{?$/
       expected "user www-data;\nworker_processes auto;\npid /run/nginx.pid;\n\nevents {\n\tworker_connections 768;\n...#\tserver {\n#\t\tlisten     localhost:143;\n#\t\tprotocol   imap;\n#\t\tproxy      on;\n#\t}\n#}\n" to match /^\s*if\s+\(\$request_method\s+\!\~\s+\^\(GET\|HEAD\|POST\)\$\)\{?$/
       Diff:
       @@ -1,2 +1,86 @@
       -/^\s*if\s+\(\$request_method\s+\!\~\s+\^\(GET\|HEAD\|POST\)\$\)\{?$/
       +user www-data;
       +worker_processes auto;
       +pid /run/nginx.pid;
       +
       +events {
       +  worker_connections 768;
       +  # multi_accept on;
       +}
       +
       +http {
       +
       +  ##
       +  # Basic Settings
       +  ##
       +
       +  sendfile on;
       +  tcp_nopush on;
       +  tcp_nodelay on;
       +  keepalive_timeout 65;
       +  types_hash_max_size 2048;
       +  # server_tokens off;
       +
       +  # server_names_hash_bucket_size 64;
       +  # server_name_in_redirect off;
       +
       +  include /etc/nginx/mime.types;
       +  default_type application/octet-stream;
       +
       +  ##
       +  # SSL Settings
       +  ##
       +
       +  ssl_protocols TLSv1 TLSv1.1 TLSv1.2; # Dropping SSLv3, ref: POODLE
       +  ssl_prefer_server_ciphers on;
       +
       +  ##
       +  # Logging Settings
       +  ##
       +
       +  access_log /var/log/nginx/access.log;
       +  error_log /var/log/nginx/error.log;
       +
       +  ##
       +  # Gzip Settings
       +  ##
       +
       +  gzip on;
       +  gzip_disable "msie6";
       +
       +  # gzip_vary on;
       +  # gzip_proxied any;
       +  # gzip_comp_level 6;
       +  # gzip_buffers 16 8k;
       +  # gzip_http_version 1.1;
       +  # gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
       +
       +  ##
       +  # Virtual Host Configs
       +  ##
       +
       +  include /etc/nginx/conf.d/*.conf;
       +  include /etc/nginx/sites-enabled/*;
       +}
       +
       +
       +#mail {
       +# # See sample authentication script at:
       +# # http://wiki.nginx.org/ImapAuthenticateWithApachePhpScript
       +#
       +# # auth_http localhost/auth.php;
       +# # pop3_capabilities "TOP" "USER";
       +# # imap_capabilities "IMAP4rev1" "UIDPLUS";
       +#
       +# server {
       +#     listen     localhost:110;
       +#     protocol   pop3;
       +#     proxy      on;
       +# }
       +#
       +# server {
       +#     listen     localhost:143;
       +#     protocol   imap;
       +#     proxy      on;
       +# }
       +#}

    ↺  nginx-15: Content-Security-Policy
       ↺  Can't find file "/etc/nginx/conf.d/90.hardening.conf"
    ↺  nginx-16: Set cookie with HttpOnly and Secure flag
       ↺  Can't find file "/etc/nginx/conf.d/90.hardening.conf"


  Profile Summary: 2 successful controls, 7 control failures, 7 controls skipped
  Test Summary: 10 successful, 13 failures, 10 skipped
```

You see that many of the tests pass, while others fail and may require investigation.

You may want to extend the `nginx-baseline` with your own custom requirements. To do that, you might use what's called a _wrapper profile_. You can check out [Create a custom InSpec profile](https://learn.chef.io/modules/create-a-custom-profile#/) for a more complete example.

## Clean up

You can experiment more with your setup. When you're done experimenting, run `exit` to leave your workstation container.

```
$ exit
```

Run `ls my_nginx` and you see that the `my_nginx` profile still exists on your system. We leave these files so you can experiment and refer to them later.

```
$ ls my_nginx
  README.md   controls    files       inspec.lock inspec.yml  libraries
```

Run the following `docker-compose down` command to destroy your setup.

```Keep in mind that this command will destroy your setup and delete the Docker images from disk. Omit the --rmi all argument to delete the containers but keep the images on disk.```

```
$ docker-compose -f docker-compose-nginx.yml down --rmi all
```

To bring up a fresh installation, run the `docker-compose up -d` command as you did in [step 1](https://learn.chef.io/modules/explore-inspec-resources#/step1).

Other Learn Chef modules use a similar Docker setup. Docker caches your workstation container's ~/.ssh/known_hosts file on your host system. Delete this file to avoid any conflicts the next time you spin up a Docker environment for Learn Chef.

```
$ rm ~/learn-inspec/.ssh/known_hosts
```
