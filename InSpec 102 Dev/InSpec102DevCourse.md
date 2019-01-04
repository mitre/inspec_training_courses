<!-- $theme: gaia -->
<!-- $size: 16:9 -->
<!-- page_number: true -->

# InSpec Developer Course 102

---
## Table of contents
1. [About InSpec](#about-inspec)
2. [Course Overview](#course-overview)
3. [Environment Setup](#environment-setup)
4. [Creating InSpec profile](#creating-inspec-profile)
5. [InSpec Shell](#inspec-shell)
6. [Analyze Results](#analyze-results)
7. [Automation Tools](#automation-tools)
8. [Create basic profile](#create-basic-profile)

---
## About InSpec
- InSpec is an open-source, community-developed  compliance validation framework
- Provides a mechanism for defining machine-readable compliance and security requirements
- Easy to create, validate, and read content
- Cross-platform (Windows, Linux, Mac)
- Agnostic to other DevOps tools and techniques
- Integrates into multiple CM tools

---
### Orchestration, Configuration Management, Validation to Deployment
InSpec operates with most orchestration and CM tools found in the DevOps pipeline implementations
![Alt text](../images/InSpec_Orchestration.png?raw=true "InSpec Orchestration")

---
### Automating Security Validation Using InSpec
![Alt text](../images/Automating_Security_Validation.png?raw=true "Automating Security Validation")

---
### Processing InSpec Results
![Alt text](../images/Processing_InSpec_Results.png?raw=true "Processing InSpec Results")

---
## Course Overview
### InSpec Profile Structure
![Alt text](../images/Profile_Structure.png?raw=true "Profile Structure")

---
### InSpec Controls Structure
![Alt text](../images/Controls_Structure.png?raw=true "Controls Structure")

---
### InSpec Results
#### Failure
![Alt text](../images/InSpec_Failure.png?raw=true "InSpec Failure")

---
#### Pass
![Alt text](../images/InSpec_Pass.png?raw=true "InSpec Pass")

---
#### Multiple Controls
![Alt text](../images/InSpec_Multiple_Controls.png?raw=true "InSpec Multiple Controls")

---
### Tooling and Reporting
![Alt text](../images/Tooling_Reporting.png?raw=true "Tooling Reporting")

---
## Environment Setup
# TODO: Update this section to use virtualbox images instead

Start by creating a working directory. We recommend ~/learn-inspec.
`mkdir ~/learn-inspec`

Next, move to your working directory.
`cd ~/learn-inspec`

Next, get the Docker Compose file. Run the command that matches your system to download a file named `docker-compose-nginx.yml`.

---
**Windows:**

```$ Invoke-WebRequest -useb -o docker-compose-nginx.yml https://raw.githubusercontent.com/learn-chef/inspec/master/docker-compose-nginx.yml```

**Mac:**

```curl -o docker-compose-nginx.yml -s https://raw.githubusercontent.com/learn-chef/inspec/master/docker-compose-nginx.yml```

**Linux:**

```$ wget -O docker-compose-nginx.yml https://raw.githubusercontent.com/learn-chef/inspec/master/docker-compose-nginx.yml```

---
Next, run the following `docker-compose` command to retrieve the latest workstation images.

```$ docker-compose -f docker-compose-nginx.yml pull```

Next, run the following `docker-compose` command to start the containers. The `-d` argument starts the containers in the background.

```$ docker-compose -f docker-compose-nginx.yml up -d```

Now that your containers are running in the background, run this command to start an interactive Bash session on the workstation container.

```$ docker exec -it workstation bash```

---
We will need to update the version of InSpec that is on the docker image to the latest version of InSpec, run this command in the bash session.

```$ curl https://omnitruck.chef.io/install.sh | bash -s -- -P inspec```

The workstation can connect to the target by the target's name, target. Run curl target and you see that NGINX is running.

---
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
...
...
<p><em>Thank you for using nginx.</em></p>
</body>
</html>
```

---
## Creating InSpec profile
# TODO: Update all connections for the above new virtualbox images

Let's start by creating a profile that will contain NGINX tests.

Start by moving to the /root directory.

```$ cd ~```

Next, create an InSpec profile named my_nginx.

`inspec init profile my_nginx`

The terminal output should look like the following:

---
```
$ inspec init profile my_nginx
Create new profile at /root/my_nginx
 * Create directory controls
 * Create file controls/example.rb
 * Create file inspec.yml
 * Create directory libraries
 * Create file README.md
```

---
### Understanding the profile structured

Let's take a look at how the profile is structured. We'll start with how a profile's files are structured and then move to what makes up an InSpec control.

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

---
Here's the role of each component.

* `README.md` provides documentation about the profile, including what it covers and how to run it.
* The `controls` directory contains files which implement the InSpec tests.
* `inspec.yml` provides metadata, or information, about the profile. Metadata includes the profile's description, author, copyright, and version.
* The `libraries` directory contains resource extensions. A resource extension enables you to [define your own resource types](https://www.inspec.io/docs/reference/dsl_resource/). You won't work with resource extensions in this module.

---
### Understand a control's structure

Let's take a look at the default control file, `controls/example.rb`.

---
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

---
This example shows two tests. Both tests check for the existence of the `/tmp` directory. The second test provides additional information about the test. Let's break down each component.

* `control` (line 12) is followed by the control's name. Each control in a profile has a unique name.
* `impact` (line 13) measures the relative importance of the test and must be a value between 0.0 and 1.0.
* `title` (line 14) defines the control's purpose.
* `desc` (line 15) provides a more complete description of what the control checks for.
* `describe` (lines 16 — 18) defines the test. Here, the test checks for the existence of the `/tmp` directory.

---
In Ruby, the `do` and `end` keywords define a [block](http://ruby-for-beginners.rubymonstas.org/blocks.html). An InSpec control always contains at least one `describe` block. However, a control can contain many `describe` blocks.

---
### Understand a describe block's structure

As with many test frameworks, InSpec code resembles natural language. Here's the format of a describe block.

```ruby
describe <entity> do
  it { <expectation> }
end
```

An InSpec test has two main components: the subject to examine and the subject's expected state. Here, `<entity>` is the subject you want to examine, for example, a package name, service, file, or network port. The `<expectation>` part specifies the desired result or expected state, for example, that a port should be open (or perhaps should not be open.)

---
Let's take a closer look at the `describe` block in the example.

```ruby
describe file('/tmp') do
  it { should be_directory }
end
```

Because InSpec resembles human-readable language, you might read this test as "/tmp should be a directory." Let's break down each component.

---
#### file

[file](https://www.inspec.io/docs/reference/resources/file/) is an InSpec [resource](https://www.inspec.io/docs/reference/resources/). If you're familiar with Chef, you know that a resource configures one part of the system. InSpec resources are similar. For example, the InSpec file resource tests for file attributes, including a file's owner, mode, and permissions. The example examines the /tmp directory.

---
#### it

The `it` statement validates one of your resource's features. A `describe` block contains one or more `it` statements. `it` enables you to test the resource itself. You'll also see `its`, which describes some feature of the resource, such as its mode or owner. You'll see examples of both `it` and `its` shortly.

---
#### should

`should` describes the expectation. `should` asserts that the condition that follows _should_ be true. Alternatively, `should_not` asserts that the condition that follows _should not_ be true. You'll see examples of both shortly.

---
#### be_directory

`be_directory` is an example of a [matcher](https://www.inspec.io/docs/reference/matchers/). A matcher compares a resource's actual value to its expected value. InSpec provides several predefined matchers. The `file` resource provides the `be_directory` matcher.

---
## InSpec Shell

Before we test our NGINX configuration, let's plan which resources and matchers we'll need.

When writing InSpec code, many resources are available to you.

* You can [explore the InSpec documentation](https://www.inspec.io/docs/) to see which resources and matchers are available.
* You can [examine the source code](https://github.com/inspec/inspec) to see what's available. For example, you can see how file and other InSpec resources are implemented.
* You can also use examples, such as profiles provided on [Chef Supermarket](https://supermarket.chef.io/tools-directory), as a guide.

---
There's also [InSpec shell](https://www.inspec.io/docs/reference/shell/), which enables you to explore InSpec interactively. In this part, you'll use the InSpec shell to discover which resources you can use to test your NGINX configuration.

You're not required to use InSpec shell to develop your profiles. Some users find the InSpec shell to be a useful way to get immediate feedback and explore what's available. You can also use InSpec shell to debug your profiles.

---
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

---
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
...
```

---
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
         ...
         - file
         ...
         - xml
         - yaml
         - yum
         - yumrepo
```

You see `file` and other resources listed.

---
### Explore the file resource

Earlier, you saw this `describe` block.

```ruby
describe file('/tmp') do                  # The actual test
  it { should be_directory }
end
```

Let's run a few commands from the InSpec shell to see how the `file` resource works.

InSpec is built on the Ruby programming language. InSpec matchers are implemented as Ruby methods. Run this command to list which methods are available to the `file` resource.

---
```
inspec> file('/tmp').class.superclass.instance_methods(false).sort
        => [:allowed?,
         :basename,
         :block_device?,
         :character_device?,
         :contain,
         :content,
         :directory?,
         ...
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

---
You can use the arrow or Page Up and Page Down keys to scroll through the list. When you're done, press `Q`.

```InSpec shell is based on a tool called pry. If you're not familiar with pry or other REPL tools, later you can check out pry to learn more.```

As an example, call the `file.directory?` method.

```
inspec> file('/tmp').directory?
        => true
```

You see that the `/tmp` directory exists on your workstation container.

---
InSpec transforms resource methods to matchers. For example, the `file.directory?` method becomes the `be_directory` matcher. The `file.readable?` method becomes the `be_readable` matcher.

---
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

---
In practice, you don't typically run controls interactively, but it's a great way to test out your ideas.

```
A Ruby method that ends in ?, such as directory? is known as a predicate method. The ? syntax is intended to make Ruby code easier to read.

A predicate method typically returns a value that can be evaluated as true or false. In Ruby, false and nil are false; everything else evaluates to true.
```

---
### Explore the nginx resource

Now's a good time to define the requirements for our NGINX configuration. Let's say that you require:

---
1. NGINX version 1.10.3 or later.
2. the following NGINX modules to be installed:
   * `http_ssl`
   * `stream_ssl`
   * `mail_ssl`
3. the NGINX configuration file, `/etc/nginx/nginx.conf`, to:
   * be owned by the `root` user and group.
   * not be readable, writeable, or executable by others.

---
Let's see what resources are available to help define these requirements as InSpec controls.

---
Run `help resources` a second time. Notice InSpec provides two built-in resources to support NGINX – `nginx` and `nginx_conf`.

```
inspec> help resources
         - aide_conf
         - apache
         - apache_conf
         - apt
         ...
         - nginx
         - nginx_conf
         ...
         - xml
         - yaml
         - yum
         - yumrepo
         - zfs_dataset
         - zfs_pool
```

---
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
         ...
         :to_s,
         :version]
```

---
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

---
Although you've discovered the methods you need – `version` and `modules` – let's run InSpec shell commands against the target that does have NGINX installed to see what results we find. To do so, first start by exiting your InSpec shell session.

```
inspec> exit
```

---
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

---
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

---
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

---
You see that the required modules, `http_ssl`, `stream_ssl`, and `mail_ssl`, are installed.

The [nginx_conf](https://www.inspec.io/docs/reference/resources/nginx_conf/) resource examines the contents of the NGINX configuration file, `/etc/nginx/nginx.conf`.

Recall that the third requirement is to check whether the NGINX configuration file is owned by `root` and is not readable, writeable, or executable by others. Because we want to test attributes of the file itself, and not its contents, you'll use the `file` resource.

You saw earlier how the `file` resource provides the `readable`, `writeable`, and `executable` methods. You would also see that the `file` resource provides the `owned_by` and `grouped_into` methods.

---
```
inspec> file('/tmp').class.superclass.instance_methods(false).sort
        => [:allowed?,
         :directory?,
         :executable?,
         :exist?,
         :file,
         :file?,
         :file_version,
         :gid,
         :group,
         :grouped_into?,
         ...
         :owned_by?,
         ...
         :readable?,
         ...
         :to_s,
         :type,
         :uid,
         :version?,
         :writable?]
```

---
These 5 `file` methods – `grouped_into`, `executable`, `owned_by`, `readable` and `writeable` – provide everything we need for the third requirement.

Exit the InSpec shell session.

```
inspec> exit
```

---
### Write the InSpec controls

Now that you understand which methods map to each requirement, you're ready to write InSpec controls.

To review, recall that you require:

---
1. NGINX version 1.10.3 or later.
2. the following NGINX modules to be installed:
   * `http_ssl`
   * `stream_ssl`
   * `mail_ssl`
3. the NGINX configuration file, `/etc/nginx/nginx.conf`, to:
   * be owned by the `root` user and group.
   * not be readable, writeable, or executable by others.

---
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

---
`cmp` is one of InSpec's [built-in matchers](https://www.inspec.io/docs/reference/matchers/). `cmp` understands version numbers and can use the operators ==, <, <=, >=, and >. `cmp` compares versions by each segment, not as a string. For example, "7.4" is less than than "7.30".

---
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

---
The second requirement verifies that these modules are installed.

* http_ssl
* stream_ssl
* mail_ssl

---
Modify your control file like this.

```ruby
...

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

---
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

---
The third requirement verifies that the NGINX configuration file, `/etc/nginx/nginx.conf`:

* is owned by the root user and group.
* is not be readable, writeable, or executable by others.

---
Modify your control file like this.

```ruby
...
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

---
Run `inspec exec` on the target.

```
$ inspec exec /root/my_nginx -t ssh://root:password@target

  Profile: InSpec Profile (my_nginx)
  Version: 0.1.0
  Target:  ssh://root@target:22

    ...
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

---
This time you see a failure. You discover that `/etc/nginx/nginx.conf` is potentially readable by others. Because this control also has an impact of 1.0, your team may need to investigate further.

Remember, the first step, detect, is where you identify where the problems are so that you can accurately assess risk and prioritize remediation actions. For the second step, correct, you can use Chef or some other continuous automation framework to correct compliance failures for you. You won't correct this issue in this module, but later you can check out the [Integrated Compliance with Chef](https://learn.chef.io/tracks/integrated-compliance#/) track to learn more about how to correct compliance issues using Chef.

---
### Refactor the code to use Attributes
Your `my_nginx` profile is off to a great start. As your requirements evolve, you can add additional controls. You can also run this profile as often as you need to verify whether your systems remain in compliance.

---
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
```
---
```ruby
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

---
One way to improve these tests is to use Attributes. Attributes enable you to separate the logic of your tests from the data your tests validate. Attribute files are typically expressed as a YAML file.

Profile Attributes exist in your profile's main directory within the `inspec.yml` for global Attributes to be used across your profile or in your `attributes` folder for custom Attributes. Start by creating this directory.

```Yaml
attributes:
  - name: user
    type: string
    default: bob
```

---
Example of adding a array object of servers:


```YAML
attributes:
  - name: servers
    type: array
    default:
      - server1
      - server2
      - server3
```

To access an attribute you will use the attribute keyword. You can use this anywhere in your control code.

---
For example:

```ruby
current_user = attribute('user')

control 'system-users' do
  describe attribute('user') do
    it { should eq 'bob' }
  end

  describe current_user do
    it { should eq attribute('user') }
  end
end
```

For sensitive data it is recomended to use a secrets YAML file located on the local machine to populate the values of attributes. A secrets file will always overwrite a attributes default value. To use the secrets file run inspec exec and specify the path to that Yaml file using the --attrs attribute.

---
For example, a inspec.yml:

```YAML
attributes:
  - name: username
    type: string
    required: true
  - name: password
    type: string
    required: true
```

---
The control:

```ruby
control 'system-users' do
  impact 0.8
  desc '
    This test assures that the user "Bob" has a user installed on the system, along with a
    specified password.
  '

  describe attribute('username') do
    it { should eq 'bob' }
  end

  describe attribute('password') do
    it { should eq 'secret' }
  end
end
```

---
And a YAML file named profile-attribute.yml:

```YAML
username: bob
password: secret
```

The following command runs the tests and applies the secrets specified in profile-attribute.yml:

`inspec exec examples/profile-attribute --attrs examples/profile-attribute.yml`

To change your attributes for platform specific cases you can setup multiple --attrs files.

---
For example, a inspec.yml:

```YAML
attributes:
  - name: users
    type: array
    required: true
```

A YAML file named windows.yml

```YAML
users:
  - Administrator
  - Guest
  - Randy
```

---
A YAML file named linux.yml

```YAML
users:
  - root
  - shadow
  - rmadison
```

The control file:

```Ruby
control 'system-users' do
  impact 0.8
  desc 'Confirm the proper users are created on the system'

  describe users do
    its('usernames') { should eq attribute('users') }
  end
end
```

---
The following command runs the tests and applies the attributes specified:

```
$ inspec exec examples/profile-attribute --attrs examples/windows.yml
$ inspec exec examples/profile-attribute --attrs examples/linux.yml
```

---
### Running baseline straight from Github/Chef Supermarket
# TODO: Update connections in this section to reflect virtualbox images

In this module, we use NGINX for learning purposes. If you're interested in NGINX specifically, you may be interested in the [DevSec Nginx Baseline](https://supermarket.chef.io/tools/nginx-baseline) profile on Chef Supermarket. This profile implements many of the tests you wrote in this module.

To execute this profile on your target system, run this `inspec supermarket exec` command.

---
```
$ inspec supermarket exec dev-sec/nginx-baseline -t ssh://root:password@target
  [2018-05-03T03:07:51+00:00] WARN: URL target https://github.com/dev-sec/nginx-baseline transformed to https://github.com/dev-sec/nginx-baseline/archive/master.tar.gz. Consider using the git fetcher

  Profile: DevSec Nginx Baseline (nginx-baseline)
  Version: 2.1.0
  Target:  ssh://root@target:22

    ...
    ×  nginx-02: Check NGINX config file owner, group and permissions. (1 failed)
       ...
       ×  File /etc/nginx/nginx.conf should not be readable by others
       expected File /etc/nginx/nginx.conf not to be readable by others
       ...
       ↺  nginx-15: Content-Security-Policy
          ↺  Can't find file "/etc/nginx/conf.d/90.hardening.conf"
       ↺  nginx-16: Set cookie with HttpOnly and Secure flag
          ↺  Can't find file "/etc/nginx/conf.d/90.hardening.conf"


     Profile Summary: 2 successful controls, 7 control failures, 7 controls skipped
     Test Summary: 10 successful, 13 failures, 10 skipped
```

---
You see that many of the tests pass, while others fail and may require investigation.

You may want to extend the `nginx-baseline` with your own custom requirements. To do that, you might use what's called a _wrapper profile_. You can check out [Create a custom InSpec profile](https://learn.chef.io/modules/create-a-custom-profile#/) for a more complete example.

---
## Analyze Results
# TODO: Update this section to run reporter on above example of nginx

InSpec allows you to output your test results to one or more reporters. You can configure the reporter(s) using either the --json-config option or the --reporter option. While you can configure multiple reporters to write to different files, only one reporter can output to the screen(stdout).

### Syntax

You can specify one or more reporters using the --reporter cli flag. You can also specify a output by appending a path separated by a colon.

---
Output json to screen.

```
inspec exec example_profile --reporter json
or
inspec exec example_profile --reporter json:-
```

Output yaml to screen

```
inspec exec example_profile --reporter yaml
or
inspec exec example_profile --reporter yaml:-
```

Output cli to screen and write json to a file.

`inspec exec example_profile --reporter cli json:/tmp/output.json`

---
Output nothing to screen and write junit and html to a file.

`inspec exec example_profile --reporter junit:/tmp/junit.xml html:www/index.html`

Output json to screen and write to a file. Write junit to a file.

`inspec exec example_profile --reporter json junit:/tmp/junit.xml | tee out.json`

If you wish to pass the profiles directly after specifying the reporters you will need to use the end of options flag --.

`inspec exec --reporter json junit:/tmp/junit.xml -- profile1 profile2`

If you are using the cli option --json-config you can also set reporters.

---
Output cli to screen.

```json
{
    "reporter": {
        "cli" : {
            "stdout" : true
        }
    }
}
```

---
Output cli to screen and write json to a file.

```json
{
    "reporter": {
        "cli" : {
            "stdout" : true
        },
        "json" : {
            "file" : "/tmp/output.json",
            "stdout" : false
        }
    }
}
```

---
### Supported Reporters

The following are the current supported reporters:

cli
This is the basic text base report. It includes details about which tests passed and failed and includes an overall summary at the end.

json
This reporter includes all information about the profiles and test results in standard json format.

json-min
This reporter is a redacted version of the json and only includes test results.

---
yaml
This reporter includes all information about the profiles and test results in standard yaml format.

documentation
This reporter is a very minimal text base report. It shows you which tests passed by name and has a small summary at the end.

junit
This reporter outputs the standard junit spec in xml format.

progress
This reporter is very condensed and gives you a .(pass), f(fail), or *(skip) character per test and a small summary at the end.

---
json-rspec
This reporter includes all information from the rspec runner. Unlike the json reporter this includes rspec specific details.

html
This renders html code to view your tests in a browser. It includes all the test and summary information.

---
## Automation Tools
Navigate to the web page for [Heimdall Lite](https://mitre.github.io/heimdall-lite/)

---
Click on the button `Load Json`
![Alt text](../images/Heimdall_Load.png?raw=true "Heimdall Load")

---
Click on the button `Browse`
![Alt text](../images/Heimdall_Browse.png?raw=true "Heimdall Browse")

---
Navigate to your json output file that you saved from your previous step and select that file then click open.

This will allow you to view the InSpec results in the Heimdall viewer.

---
## Create basic profile
### Download CIS Here
ADD CIS DOWNLOAD LINK

---
### Example Control V-13621
Let's take a look at how we would write a the InSpec control for V-13621:
```ruby
NGINX_DISALLOWED_FILE_LIST = attribute(
  'nginx_disallowed_file_list',
  description: 'File list of  documentation, sample code, example applications, and tutorials.',
  default: ["/usr/share/man/man8/nginx.8.gz"]
)

NGINX_EXCEPTION_FILES = attribute(
  'nginx_allowed_file_list',
  description: 'File list of allowed documentation, sample code, example applications, and tutorials.',
  default: [
           ]
)

NGINX_OWNER = attribute(
  'nginx_owner',
  description: "The Nginx owner",
  default: 'nginx'
)

SYS_ADMIN = attribute(
  'sys_admin',
  description: "The system adminstrator",
  default: ['root']
)

NGINX_GROUP = attribute(
  'nginx_group',
  description: "The Nginx group",
  default: 'nginx'
)

SYS_ADMIN_GROUP = attribute(
  'sys_admin_group',
  description: "The system adminstrator group",
  default: ['root']
)

only_if do
  package('nginx').installed? || command('nginx').exist?
end

control "V-13621" do

  title "All web server documentation, sample code, example applications, and
  tutorials must be removed from a production web server."

  desc "Web server documentation, sample code, example applications, and
  tutorials may be an exploitable threat to a web server. A production web
  server may only contain components that are operationally necessary (e.g.,
  compiled code, scripts, web-content, etc.). Delete all directories that
  contain samples and any scripts used to execute the samples. If there is a
  requirement to maintain these directories at the site on non-production
  servers for training purposes, have permissions set to only allow access to
  authorized users (i.e., web administrators and systems administrators).
  Sample applications or scripts have not been evaluated and approved for use
  and may introduce vulnerabilities to the system."

  impact 0.7
  tag "severity": "high"
  tag "gtitle": "WG385"
  tag "gid": "V-13621"
  tag "rid": "SV-32933r1_rule"
  tag "stig_id": "WG385 A22"
  tag "nist": ["CM-6", "Rev_4"]

  tag "check": "Query the SA to determine if all directories that contain
  samples and any scripts used to execute the samples have been removed from
  the server. Each web server has its own list of sample files. This may
  change with the software versions, but the following are some examples of
  what to look for (This should not be the definitive list of sample files,
  but only an example of the common samples that are provided with the
  associated web server. This list will be updated as additional information
  is discovered.):
  ls -Ll /usr/share/man/man8/nginx.8.gz
  If there is a requirement to maintain these directories at the site for
  training or other such purposes, have permissions or set the permissions to
  only allow access to authorized users. If any sample files are found on the
  web server, this is a finding."

  begin

    authorized_sa_user_list = SYS_ADMIN.clone << NGINX_OWNER
    authorized_sa_group_list = SYS_ADMIN_GROUP.clone << NGINX_GROUP

    NGINX_DISALLOWED_FILE_LIST.each do |file|
      describe file(file) do
        it { should_not exist }
      end
    end

    NGINX_EXCEPTION_FILES.each do |file|
      describe file(file) do
        its('owner') { should be_in authorized_sa_user_list }
        its('group') { should be_in authorized_sa_group_list }
        its('mode') { should cmp '640' }
      end
    end
  rescue Exception => msg
    describe "Exception: #{msg}" do
      it { should be_nil }
    end
  end
end
```