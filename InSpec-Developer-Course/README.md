
## InSpec Developer Course

<!--ts
   * [1. InSpec Developer Course](#1-inspec-developer-course)
   * [2. Author](#2-author)
   * [3. Thank you to](#3-thank-you-to)
   * [4. Table of Contents](#4-table-of-contents)
   * [5. About InSpec](#5-about-inspec)
      * [5.1. Orchestration, Configuration Management, Validation to Deployment](#51-orchestration-configuration-management-validation-to-deployment)
      * [5.2. Automating Security Validation Using InSpec](#52-automating-security-validation-using-inspec)
      * [5.3. Processing InSpec Results](#53-processing-inspec-results)
   * [6. Course Overview](#6-course-overview)
      * [6.1. InSpec Profile Structure](#61-inspec-profile-structure)
      * [6.2. InSpec Controls Structure](#62-inspec-controls-structure)
      * [6.3. InSpec Results](#63-inspec-results)
         * [6.3.1. Failure](#631-failure)
         * [6.3.2. Pass](#632-pass)
         * [6.3.3. Multiple Controls](#633-multiple-controls)
      * [6.4. Tooling and Reporting](#64-tooling-and-reporting)
   * [7. Course Environment Setup](#7-course-environment-setup)
      * [7.1. Download and Install VirtualBox](#71-download-and-install-virtualbox)
      * [7.2. Download and Install Vagrant](#72-download-and-install-vagrant)
      * [7.3. Clone or Download-Unzip This Course Repository](#73-clone-or-download-unzip-this-course-repository)
      * [7.4. Setup Environments](#74-setup-environments)
         * [7.4.1. Run Vagrant to install the Virtual Environment](#741-run-vagrant-to-install-the-virtual-environment)
         * [7.4.2. Setup network in VirtualBox](#742-setup-network-in-virtualbox)
      * [Vagrant Credentials](#vagrant-credentials)
      * [AWS Credentials](#aws-credentials)
   * [8. Studying an InSpec profile](#8-studying-an-inspec-profile)
      * [8.1. Understanding the profile structure](#81-understanding-the-profile-structure)
      * [8.2. Understand a control's structure](#82-understand-a-controls-structure)
      * [8.3. Understand a describe block's structure](#83-understand-a-describe-blocks-structure)
         * [8.3.1. file](#831-file)
         * [8.3.2. it](#832-it)
         * [8.3.3. should](#833-should)
         * [8.3.4. be_directory](#834-be_directory)
   * [9. Exploring the InSpec Shell](#9-exploring-the-inspec-shell)
      * [9.1. Enter the shell](#91-enter-the-shell)
      * [9.2. Explore the file resource](#92-explore-the-file-resource)
      * [9.3. Explore the nginx resource](#93-explore-the-nginx-resource)
      * [9.4. Write the InSpec controls](#94-write-the-inspec-controls)
      * [9.5. Refactor the code to use Attributes](#95-refactor-the-code-to-use-attributes)
         * [9.5.1. Multiple Attribute Example](#951-multiple-attribute-example)
      * [9.6. Running baseline straight from Github/Chef Supermarket](#96-running-baseline-straight-from-githubchef-supermarket)
   * [10. Viewing and Analyzing Results](#10-viewing-and-analyzing-results)
      * [10.1. Syntax](#101-syntax)
      * [10.2. Supported Reporters](#102-supported-reporters)
      * [10.3. Putting it all together](#103-putting-it-all-together)
   * [11. Automation Tools](#11-automation-tools)
   * [12. Create basic profile - DAY 2](#12-create-basic-profile---day-2)
      * [12.1. Download STIG Requirements Here](#121-download-stig-requirements-here)
      * [12.2. Example Control V-38437](#122-example-control-v-38437)
      * [12.3. Getting Started on the RHEL6 baseline](#123-getting-started-on-the-rhel6-baseline)
      * [12.4. Completed RHEL6 Profile for Reference](#124-completed-rhel6-profile-for-reference)
   * [13. Using what you've learned](#13-using-what-youve-learned)
   * [14. Cleanup Environments](#14-cleanup-environments)
   * [15. Additional Resources](#15-additional-resources)
      * [15.1 Security Guidance](#151-security-guidance)
      * [15.2 InSpec Documentation](#152-inspec-documentation)
      * [15.3 Additional Tutorials](#153-additional-tutorials)
      * [15.4 MITRE InSpec](#154-mitre-inspec)

<!-- Added by: melsharkawi, at:  -->

<!--te-->

# About InSpec 
- InSpec is an open-source, community-developed  compliance validation framework
- Provides a mechanism for defining machine-readable compliance and security requirements
- Easy to create, validate, and read content
- Cross-platform (Windows, Linux, Mac)
- Agnostic to other DevOps tools and techniques
- Integrates into multiple CM tools

## Orchestration, Configuration Management, Validation to Deployment
InSpec operates with most orchestration and CM tools found in the DevOps pipeline implementations
![Alt text](../images/InSpec_Orchestration.png?raw=true "InSpec Orchestration")

---
## Automating Security Validation Using InSpec
![Alt text](../images/Automating_Security_Validation.png?raw=true "Automating Security Validation")

---
## 5.3. Processing InSpec Results
![Alt text](../images/Processing_InSpec_Results.png?raw=true "Processing InSpec Results")

# 6. Course Overview
## 6.1. InSpec Profile Structure
![Alt text](../images/Profile_Structure.png?raw=true "Profile Structure")

---
## 6.2. InSpec Controls Structure
![Alt text](../images/Controls_Structure.png?raw=true "Controls Structure")

---
## 6.3. InSpec Results
### 6.3.1. Failure
![Alt text](../images/InSpec_Failure.png?raw=true "InSpec Failure")

---
### 6.3.2. Pass
![Alt text](../images/InSpec_Pass.png?raw=true "InSpec Pass")

---
### 6.3.3. Multiple Controls
![Alt text](../images/InSpec_Multiple_Controls.png?raw=true "InSpec Multiple Controls")

---
## 6.4. Tooling and Reporting
![Alt text](../images/Tooling_Reporting.png?raw=true "Tooling Reporting")

---


# 7. Course Environment Setup
## 7.1. Download and Install VirtualBox
[https://www.virtualbox.org/wiki/Downloads](https://www.virtualbox.org/wiki/Downloads)

## 7.2. Download and Install Vagrant
[https://www.vagrantup.com/downloads.html](https://www.vagrantup.com/downloads.html)

## 7.3. Clone or Download-Unzip This Course Repository
[https://github.com/mitre/inspec_training_courses](https://github.com/mitre/inspec_training_courses)



## 7.4. Setup Environments
Start by creating a working directory. We recommend ~/learn-inspec.  
`mkdir ~/learn-inspec`  [or from Windows cmd prompt: `mkdir Desktop/learn-inspec`]

Next, move to your working directory.  
`cd ~/learn-inspec`  [or from Windows cmd prompt: `cd Desktop/learn-inspec`]

### 7.4.1. Run Vagrant to install the Virtual Environment
Navigate to the `InSpec 102 Dev` folder and run the following command:  
`$ vagrant up`

Wait for vagrant to finish standing up the virtual environments.

### 7.4.2. Setup network in VirtualBox
Open VirtualBox and shut down the 3 vm's that were created `workstation`, `target`, `target-centos6`.

Open Preference settings for VirtualBox (**not** the settings for the VM's)
- Go to the network tab
- From there click the + symbol to add a new NatNetwork
- Once you do that your preferences should look like this below:
![Alt text](../images/Create_NatNetwork.png?raw=true "Create NatNetwork")

Click ok to save the settings.

The following step you will repeat for the 3 vm's `workstation`, `target`, `target-centos6`.
 - Select the virtual machine
 - Click on settings for the virtual machine
 - Navigate to the network tab
 - For `Attached to:` Select `NatNetwork`
 - For `Name` make sure the same NatNetwork is selected for all the virtual machines
 - Click on Advanced dropdown and For `Promiscuous Mode:` make sure to select `Allow VMs`
 - Once you do these steps your preferences should look like this below:

 ![Alt text](../images/NatNetwork_VM_Setup.png?raw=true "NatNetwork VM Setup")

 - Next you need to Select the Shared Folders
 - Click the + symbol to add a new Shared Folder
 ![Alt text](../images/Add_Shared_Folder.png?raw=true "Add Shared Folder")
 - For Folder Path select the dropdown and select `Other`, navigate to your `~/learn-inspec` folder and select that
 ![Alt text](../images/Select_Shared_Folder.png?raw=true "Select Shared Folder")
 - Select the checkbox for Auto-mount
 ![Alt text](../images/Configure_Shared_Folder.png?raw=true "Configure Shared Folder")
 - Click ok to confirm the shared folder.
 - Once you do these steps your preferences should look like this below:
![Alt text](../images/Final_Shared_Folder.png?raw=true "Final Shared Folder")
 - Once more click ok to confirm and save the settings




Once the above operations are completed you can startup up the `workstation` and `target` vm's since we will start with those.

```bash
Vagrant Credentials
---
Workstation Credentials:  
u: vagrant  
p: vagrant

Target Credentials:  
u: root  
p: password

Target-CentOS6:  
u: vagrant  
p: vagrant

AWS Credentials
---
Target:  
u: ubuntu

Target-CentOS6:  
u: ec2-user
```

---
The workstation can connect to the target by the target's ip, perform an `ifconfig` on the target to get it's ip. Run curl TARGET_IP and you see that NGINX is running.

```html
$ curl TARGET_IP

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



# 8. Studying an InSpec profile
Let's start by creating a profile that will contain NGINX tests.

Start by moving to the /root directory.

```bash
$ cd ~
```

Next, create an InSpec profile named my_nginx.

```bash
inspec init profile my_nginx
```

The terminal output should look like the following:

```bash
$ inspec init profile my_nginx
Create new profile at /root/my_nginx
 * Create directory controls
 * Create file controls/example.rb
 * Create file inspec.yml
 * Create directory libraries
 * Create file README.md
```



## 8.1. Understanding the profile structure

Let's take a look at how the profile is structured. We'll start with how a profile's files are structured and then move to what makes up an InSpec control.

First, run `tree` to see what's in the `my_nginx` profile.

```bash
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



## 8.2. Understand a control's structure

Let's take a look at the default control file, `controls/example.rb`.

```ruby
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
::: tip test
this is a good tip
:::

This example shows two tests. Both tests check for the existence of the `/tmp` directory. The second test provides additional information about the test. Let's break down each component.

* `control` (line 12) is followed by the control's name. Each control in a profile has a unique name.
* `impact` (line 13) measures the relative importance of the test and must be a value between 0.0 and 1.0.
* `title` (line 14) defines the control's purpose.
* `desc` (line 15) provides a more complete description of what the control checks for.
* `describe` (lines 16 — 18) defines the test. Here, the test checks for the existence of the `/tmp` directory.

In Ruby, the `do` and `end` keywords define a [block](http://ruby-for-beginners.rubymonstas.org/blocks.html). An InSpec control always contains at least one `describe` block. However, a control can contain many `describe` blocks.



## 8.3. Understand a describe block's structure

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

---
### 8.3.1. file

[file](https://www.inspec.io/docs/reference/resources/file/) is an InSpec [resource](https://www.inspec.io/docs/reference/resources/). If you're familiar with Chef, you know that a resource configures one part of the system. InSpec resources are similar. For example, the InSpec file resource tests for file attributes, including a file's owner, mode, and permissions. The example examines the /tmp directory.

---
### 8.3.2. it

The `it` statement validates one of your resource's features. A `describe` block contains one or more `it` statements. `it` enables you to test the resource itself. You'll also see `its`, which describes some feature of the resource, such as its mode or owner. You'll see examples of both `it` and `its` shortly.

---
### 8.3.3. should

`should` describes the expectation. `should` asserts that the condition that follows _should_ be true. Alternatively, `should_not` asserts that the condition that follows _should not_ be true. You'll see examples of both shortly.

---
### 8.3.4. be_directory

`be_directory` is an example of a [matcher](https://www.inspec.io/docs/reference/matchers/). A matcher compares a resource's actual value to its expected value. InSpec provides several predefined matchers. The `file` resource provides the `be_directory` matcher.



# 9. Exploring the InSpec Shell

Before we test our NGINX configuration, let's plan which resources and matchers we'll need.

When writing InSpec code, many resources are available to you.

* You can [explore the InSpec documentation](https://www.inspec.io/docs/) to see which resources and matchers are available.
* You can [examine the source code](https://github.com/inspec/inspec) to see what's available. For example, you can see how file and other InSpec resources are implemented.
* You can also use examples, such as profiles provided on [Chef Supermarket](https://supermarket.chef.io/tools-directory), as a guide.

There's also [InSpec shell](https://www.inspec.io/docs/reference/shell/), which enables you to explore InSpec interactively. In this part, you'll use the InSpec shell to discover which resources you can use to test your NGINX configuration.

You're not required to use InSpec shell to develop your profiles. Some users find the InSpec shell to be a useful way to get immediate feedback and explore what's available. You can also use InSpec shell to debug your profiles.



## 9.1. Enter the shell

Run `inspec shell` to enter the interactive session.

```bash
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

```bash
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

Run `help resources` to see which resources are available.

```bash
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



## 9.2. Explore the file resource

Earlier, you saw this `describe` block.

```ruby
describe file('/tmp') do                  # The actual test
  it { should be_directory }
end
```

Let's run a few commands from the InSpec shell to see how the `file` resource works.

InSpec is built on the Ruby programming language. InSpec matchers are implemented as Ruby methods. Run this command to list which methods are available to the `file` resource.

```bash
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

You can use the arrow or Page Up and Page Down keys to scroll through the list. When you're done, press `Q`.

```bash
InSpec shell is based on a tool called pry. If you're not familiar with pry or other REPL tools, later you can check out pry to learn more.
```

As an example, call the `file.directory?` method.

```bash
inspec> file('/tmp').directory?
        => true
```

You see that the `/tmp` directory exists on your workstation container.

InSpec transforms resource methods to matchers. For example, the `file.directory?` method becomes the `be_directory` matcher. The `file.readable?` method becomes the `be_readable` matcher.

The InSpec shell understands the structure of blocks. This enables you to run mutiline code. As an example, run the entire `describe` block like this.

```bash
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

```bash
A Ruby method that ends in ?, such as directory? is known as a predicate method. The ? syntax is intended to make Ruby code easier to read.

A predicate method typically returns a value that can be evaluated as true or false. In Ruby, false and nil are false; everything else evaluates to true.
```



## 9.3. Explore the nginx resource

Now's a good time to define the requirements for our NGINX configuration. Let's say that you require:

```
1. NGINX version 1.10.3 or later.
2. the following NGINX modules to be installed:
   * `http_ssl`
   * `stream_ssl`
   * `mail_ssl`
3. the NGINX configuration file, `/etc/nginx/nginx.conf`, to:
   * be owned by the `root` user and group.
   * not be readable, writeable, or executable by others.

```

Let's see what resources are available to help define these requirements as InSpec controls.

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
$ inspec shell -t ssh://TARGET_USERNAME:TARGET_PASSWORD@TARGET_IP
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

These 5 `file` methods – `grouped_into`, `executable`, `owned_by`, `readable` and `writeable` – provide everything we need for the third requirement.

Exit the InSpec shell session.

```
inspec> exit
```



## 9.4. Write the InSpec controls

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
:::tip The `nginx_conf` resource docs
[`nginx_conf`](https://www.inspec.io/docs/reference/resources/nginx_conf/)
:::

The test has an impact of 1.0, meaning it is most critical. A failure might indicate to the team that this issue should be resolved as soon as possible, likely by upgrading NGINX to a newer version. The test compares `nginx.version` against version 1.10.3.

`cmp` is one of InSpec's [built-in matchers](https://www.inspec.io/docs/reference/matchers/). `cmp` understands version numbers and can use the operators ==, <, <=, >=, and >. `cmp` compares versions by each segment, not as a string. For example, "7.4" is less than than "7.30".

Next, run `inspec exec` to execute the profile on the remote target.

```
$ inspec exec /root/my_nginx -t ssh://TARGET_USERNAME:TARGET_PASSWORD@TARGET_IP

  Profile: InSpec Profile (my_nginx)
  Version: 0.1.0
  Target:  ssh://TARGET_USERNAME@TARGET_IP:22

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
...

control 'nginx-modules' do
  impact 1.0
  title 'NGINX modules'
  desc 'The required NGINX modules should be installed.'
  describe nginx do
    its('modules') { should include 'http_ssl' }
    its('modules') { should include 'stream_ssl' }
    its('modules') { should include 'mail_ssl' }
  end
end
```
:::tip The `nginx_conf` resource docs
[`nginx_conf`](https://www.inspec.io/docs/reference/resources/nginx_conf/)
:::

The second control resembles the first; however, this version uses multiple `its` statements and the `nginx.modules` method. The `nginx.modules` method returns a list; the built-in `include` matcher verifies whether a value belongs to a given list.

Run `inspec exec` on the target.

```
$ inspec exec /root/my_nginx -t ssh://TARGET_USERNAME:TARGET_PASSWORD@TARGET_IP

  Profile: InSpec Profile (my_nginx)
  Version: 0.1.0
  Target:  ssh://TARGET_USERNAME@TARGET_IP:22

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
:::tip The `file` resource docs
[`file`](https://www.inspec.io/docs/reference/resources/file/)
:::

The third control uses the `file` resource. The first 2 tests use `should` to verify the `root` owner and group. The last 3 tests use `should_not` to verify that the file is not readable, writable, or executable by others.

Run `inspec exec` on the target.

```
$ inspec exec /root/my_nginx -t ssh://TARGET_USERNAME:TARGET_PASSWORD@TARGET_IP

  Profile: InSpec Profile (my_nginx)
  Version: 0.1.0
  Target:  ssh://TARGET_USERNAME@TARGET_IP:22

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

This time you see a failure. You discover that `/etc/nginx/nginx.conf` is potentially readable by others. Because this control also has an impact of 1.0, your team may need to investigate further.

Remember, the first step, detect, is where you identify where the problems are so that you can accurately assess risk and prioritize remediation actions. For the second step, correct, you can use Chef or some other continuous automation framework to correct compliance failures for you. You won't correct this issue in this module, but later you can check out the [Integrated Compliance with Chef](https://learn.chef.io/tracks/integrated-compliance#/) track to learn more about how to correct compliance issues using Chef.



## 9.5. Refactor the code to use Attributes
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
:::tip The `nginx_conf` resource docs
[`nginx_conf`](https://www.inspec.io/docs/reference/resources/nginx_conf/)
:::

control 'nginx-modules' do
  impact 1.0
  title 'NGINX modules'
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
:::tip The `nginx_conf` resource docs
[`nginx_conf`](https://www.inspec.io/docs/reference/resources/nginx_conf/)
:::

Although these rules do what you expect, imagine your control file contains dozens or hundreds of tests. As the data you check for, such as the version or which modules are installed, evolve, it can become tedious to locate and update your tests. You may also find that you repeat the same data in across multiple control files.

One way to improve these tests is to use Attributes. Attributes enable you to separate the logic of your tests from the data your tests validate. Attribute files are typically expressed as a YAML file.

Profile Attributes exist in your profile's main directory within the `inspec.yml` for global Attributes to be used across your profile or in your `attributes` folder for custom Attributes. Start by creating this directory.

```Yaml
name: my_nginx
title: InSpec Profile
maintainer: The Authors
copyright: The Authors
copyright_email: you@example.com
license: Apache-2.0
summary: An InSpec Compliance Profile
version: 0.1.0
supports:
  platform: os

attributes:
  - name: nginx_version
    type: string
    default: 1.10.3
```

To access an attribute you will use the attribute keyword. You can use this anywhere in your control code.

For example:

```ruby
nginx_version = attribute('nginx_version')

control 'nginx-version' do
  impact 1.0
  title 'NGINX version'
  desc 'The required version of NGINX should be installed.'
  describe nginx do
    its('version') { should cmp >= nginx_version }
  end
end
```

For our next control we require specific modules

Example of adding an array object of servers:


```YAML
attributes:
  - name: servers
    type: array
    default:
      - server1
      - server2
      - server3
```

Similarly as the above example we can edit our `inspec.yml` file like this:
```YAML
name: my_nginx
title: InSpec Profile
maintainer: The Authors
copyright: The Authors
copyright_email: you@example.com
license: Apache-2.0
summary: An InSpec Compliance Profile
version: 0.1.0
supports:
  platform: os

attributes:
  - name: nginx_version
    type: string
    default: 1.10.3
    
  - name: nginx_modules
    type: array
    default:
      - http_ssl
      - stream_ssl
      - mail_ssl
```

Your control can be changed to look like this:
```ruby
control 'nginx-modules' do
  impact 1.0
  title 'NGINX modules'
  desc 'The required NGINX modules should be installed.'
  
  nginx_modules = attribute('nginx_modules')
  
  describe nginx do
    nginx_modules.each do |current_module|
      its('modules') { should include current_module }
    end
  end
end
```

### 9.5.1. Multiple Attribute Example

To change your attributes for platform specific cases you can setup multiple --attrs files.

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

The following command runs the tests and applies the attributes specified:

```
$ inspec exec examples/profile-attribute --attrs examples/windows.yml
$ inspec exec examples/profile-attribute --attrs examples/linux.yml
```



## 9.6. Running baseline straight from Github/Chef Supermarket
In this module, we use NGINX for learning purposes. If you're interested in NGINX specifically, you may be interested in the [MITRE nginx-baseline](https://github.com/mitre/nginx-baseline) profile on GitHub. Alternatively, you may also check out the [DevSec Nginx Baseline](https://supermarket.chef.io/tools/nginx-baseline) profile on Chef Supermarket. These profiles implements many of the tests you wrote in this module.

To execute the GitHub profile on your target system, run this `inspec exec` command.

` $ inspec exec https://github.com/dev-sec/nginx-baseline -t ssh://TARGET_USERNAME:TARGET_PASSWORD@TARGET_IP `


To execute the Chef Supermarket profile on your target system, run this `inspec supermarket exec` command.

```
$ inspec supermarket exec dev-sec/nginx-baseline -t ssh://TARGET_USERNAME:TARGET_PASSWORD@TARGET_IP
  [2018-05-03T03:07:51+00:00] WARN: URL target https://github.com/dev-sec/nginx-baseline transformed to https://github.com/dev-sec/nginx-baseline/archive/master.tar.gz. Consider using the git fetcher

  Profile: DevSec Nginx Baseline (nginx-baseline)
  Version: 2.1.0
  Target:  ssh://TARGET_USERNAME@TARGET_IP:22

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

You see that many of the tests pass, while others fail and may require investigation.

You may want to extend the `nginx-baseline` with your own custom requirements. To do that, you might use what's called a _wrapper profile_. You can check out [Create a custom InSpec profile](https://learn.chef.io/modules/create-a-custom-profile#/) for a more complete example.

# 10. Viewing and Analyzing Results

InSpec allows you to output your test results to one or more reporters. You can configure the reporter(s) using either the --json-config option or the --reporter option. While you can configure multiple reporters to write to different files, only one reporter can output to the screen(stdout).
```
$ inspec exec /root/my_nginx -t ssh://TARGET_USERNAME:TARGET_PASSWORD@TARGET_IP --reporter cli json:baseline_output.json
```

## 10.1. Syntax

You can specify one or more reporters using the --reporter cli flag. You can also specify a output by appending a path separated by a colon.

Output json to screen.

```
inspec exec /root/my_nginx --reporter json
or
inspec exec /root/my_nginx --reporter json:-
```

Output yaml to screen

```
inspec exec /root/my_nginx --reporter yaml
or
inspec exec /root/my_nginx --reporter yaml:-
```

Output cli to screen and write json to a file.

`inspec exec /root/my_nginx --reporter cli json:/tmp/output.json`

Output nothing to screen and write junit and html to a file.

`inspec exec /root/my_nginx --reporter junit:/tmp/junit.xml html:www/index.html`

Output json to screen and write to a file. Write junit to a file.

`inspec exec /root/my_nginx --reporter json junit:/tmp/junit.xml | tee out.json`

If you wish to pass the profiles directly after specifying the reporters you will need to use the end of options flag --.

`inspec exec --reporter json junit:/tmp/junit.xml -- profile1 profile2`

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

## 10.2. Supported Reporters

The following are the current supported reporters:

* cli
* json
* json-min
* yaml
* documentation
* junit
* progress
* json-rspec
* html

You can read more about [InSpec Reporters](https://www.inspec.io/docs/reference/reporters/) on the documentation page.

## 10.3. Putting it all together
The following command will run the nginx baseline profile from github and use the reporter to output a json, you will need this for the next step loading it into heimdall:


` $ inspec exec https://github.com/dev-sec/nginx-baseline -t ssh://TARGET_USERNAME:TARGET_PASSWORD@TARGET_IP --reporter cli json:baseline_output.json`

# 11. Automation Tools
Navigate to the web page for [Heimdall Lite](https://mitre.github.io/heimdall-lite/)

Click on the button `Load Json`
![Alt text](../images/Heimdall_Load.png?raw=true "Heimdall Load")

Click on the button `Browse`
![Alt text](../images/Heimdall_Browse.png?raw=true "Heimdall Browse")

Navigate to your json output file that you saved from your previous step and select that file then click open.

This will allow you to view the InSpec results in the Heimdall viewer.



# 12. Create basic profile - DAY 2
## 12.1. Download STIG Requirements Here
Download the latest STIG Viewer located here [STIG Viewer](https://iase.disa.mil/stigs/pages/stig-viewing-guidance.aspx)
![Alt text](../images/Download_STIG_Viewer.png?raw=true "STIG Viewer Download")


Download the `Red Hat 6 STIG - Ver 1, Rel 21` located here [RHEL6 STIG Download](https://iase.disa.mil/stigs/Pages/a-z.aspx)
![Alt text](../images/Download_STIG.png?raw=true "RHEL6 STIG Download")



## 12.2. Example Control V-38437
Let's take a look at how we would write a the InSpec control for V-38437:
```ruby
control "V-38437" do
  title "Automated file system mounting tools must not be enabled unless
needed."
  desc  "All filesystems that are required for the successful operation of the
system should be explicitly listed in \"/etc/fstab\" by an administrator. New
filesystems should not be arbitrarily introduced via the automounter.
    The \"autofs\" daemon mounts and unmounts filesystems, such as user home
directories shared via NFS, on demand. In addition, autofs can be used to
handle removable media, and the default configuration provides the cdrom device
as \"/misc/cd\". However, this method of providing access to removable media is
not common, so autofs can almost always be disabled if NFS is not in use. Even
if NFS is required, it is almost always possible to configure filesystem mounts
statically by editing \"/etc/fstab\" rather than relying on the automounter.
  "
  impact 0.3
  tag "gtitle": "SRG-OS-999999"
  tag "gid": "V-38437"
  tag "rid": "SV-50237r1_rule"
  tag "stig_id": "RHEL-06-000526"
  tag "fix_id": "F-43381r1_fix"
  tag "cci": ["CCI-000366"]
  tag "nist": ["CM-6 b", "Rev_4"]
  tag "false_negatives": nil
  tag "false_positives": nil
  tag "documentable": false
  tag "mitigations": nil
  tag "severity_override_guidance": false
  tag "potential_impacts": nil
  tag "third_party_tools": nil
  tag "mitigation_controls": nil
  tag "responsibility": nil
  tag "ia_controls": nil
  tag "check": "To verify the \"autofs\" service is disabled, run the following
command:
chkconfig --list autofs
If properly configured, the output should be the following:
autofs 0:off 1:off 2:off 3:off 4:off 5:off 6:off
Verify the \"autofs\" service is not running:
# service autofs status
If the autofs service is enabled or running, this is a finding."
  tag "fix": "If the \"autofs\" service is not needed to dynamically mount NFS
filesystems or removable media, disable the service for all runlevels:
# chkconfig --level 0123456 autofs off
Stop the service if it is already running:
# service autofs stop"

  describe service("autofs").runlevels(/0/) do
    it { should_not be_enabled }
  end
  describe service("autofs").runlevels(/1/) do
    it { should_not be_enabled }
  end
  describe service("autofs").runlevels(/2/) do
    it { should_not be_enabled }
  end
  describe service("autofs").runlevels(/3/) do
    it { should_not be_enabled }
  end
  describe service("autofs").runlevels(/4/) do
    it { should_not be_enabled }
  end
  describe service("autofs").runlevels(/5/) do
    it { should_not be_enabled }
  end
  describe service("autofs").runlevels(/6/) do
    it { should_not be_enabled }
  end
end
```
## 12.3. Getting Started on the RHEL6 baseline

__Suggested Controls to start on:__
- V-38444
- V-38451
- V-38472
- V-38473
- V-38595

__Suggested InSpec Resources to use:__
- command
- file
- directory
- parse_config_file
- kernel_module
- package

## 12.4. Completed RHEL6 Profile for Reference

Below is the url to the completed RHEL6 Inspec Profile for reference.  
[red-hat-enterprise-linux-6-stig-baseline](https://github.com/mitre/red-hat-enterprise-linux-6-stig-baseline)



# 13. Using what you've learned

Now you should be able to
-	Describe the InSpec framework and its capabilities
-	Describe the architecture of an InSpec profile   
-	Build an InSpec profile to transform security policy into automated security testing
-	Run an InSpec profile against a component of an application stack
-	View and analyze InSpec results
-	Report results

You can contribute to existing profiles that can be found here:  
[https://github.com/mitre](https://github.com/mitre)  

Otherwise you can create your own profiles if they don't exist using the following security guidelines:
[https://iase.disa.mil/stigs/Pages/a-z.aspx](https://iase.disa.mil/stigs/Pages/a-z.aspx)  
[https://www.cisecurity.org/cis-benchmarks/](https://www.cisecurity.org/cis-benchmarks/)  



# 14. Cleanup Environments
If you're done with your vagrant boxes, run the following command to destroy them:
`vagrant destroy -f`



# 15. Additional Resources

## 15.1 Security Guidance
[https://iase.disa.mil/stigs/Pages/a-z.aspx](https://iase.disa.mil/stigs/Pages/a-z.aspx)  
[https://www.cisecurity.org/cis-benchmarks/](https://www.cisecurity.org/cis-benchmarks/)  

## 15.2 InSpec Documentation
[InSpec Docs](https://www.inspec.io/docs/)  
[InSpec Profiles](https://www.inspec.io/docs/reference/profiles/)  
[InSpec Resources](https://www.inspec.io/docs/reference/resources/)  
[InSpec Matchers](https://www.inspec.io/docs/reference/matchers/)  
[InSpec Shell](https://www.inspec.io/docs/reference/shell/)  
[InSpec Reporters](https://www.inspec.io/docs/reference/reporters/)  

## 15.3 Additional Tutorials
[What to Expect When You’re InSpec’ing](https://blog.chef.io/2018/04/03/what-to-expect-when-youre-inspecing/)  
[Getting started with InSpec - The InSpec basics series](http://www.anniehedgie.com/inspec/)  
[Windows infrastructure testing using InSpec – Part I](http://datatomix.com/?p=236)  
[Windows infrastructure testing using InSpec and Profiles – Part II](http://datatomix.com/?p=238)  

## 15.4 MITRE InSpec
[MITRE InSpec Repositories](https://github.com/orgs/mitre/teams/inspec/repositories)  
[InSpec Tools](https://github.com/mitre/inspec_tools)
