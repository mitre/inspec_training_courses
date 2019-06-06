
# InSpec Advanced Developer Course


## 1. About InSpec
- InSpec is an open-source, community-developed  compliance validation framework
- Provides a mechanism for defining machine-readable compliance and security requirements
- Easy to create, validate, and read content
- Cross-platform (Windows, Linux, Mac)
- Agnostic to other DevOps tools and techniques
- Integrates into multiple CM tools

### 1.1. Orchestration, Configuration Management, Validation to Deployment
InSpec operates with most orchestration and CM tools found in the DevOps pipeline implementations
![Alt text](../images/InSpec_Orchestration.png?raw=true "InSpec Orchestration")

---
### 1.2. Automating Security Validation Using InSpec
![Alt text](../images/Automating_Security_Validation.png?raw=true "Automating Security Validation")

---
### 1.3. Processing InSpec Results
![Alt text](../images/Processing_InSpec_Results.png?raw=true "Processing InSpec Results")

## 2. Course Overview
### 2.1. InSpec Profile Structure
```bash
$ tree nginx
      nginx
      └── profile
          ├── README.md
          ├── attributes.rb
          ├── controls
          │   ├── header_size.rb
          │   └──  ssl_certification.rb
          ├── inspec.yml
          └── libraries
              └── nginx_helper.rb
```
---
### 2.2. InSpec Controls Structure
```ruby
control "V-13727" do
  title "The worker_processes StartServers directive must be set properly."

  desc "These requirements are set to mitigate the effects of several types of
  denial of service attacks. Although there is some latitude concerning the
  settings themselves, the requirements attempt to provide reasonable limits
  for the protection of the web server. If necessary, these limits can be
  adjusted to accommodate the operational requirement of a given system."

  impact 0.5
  tag "severity": "medium"
  tag "gtitle": "WA000-WWA026"
  tag "gid": "V-13727"
  tag "rid": "SV-36645r2_rule"
  tag "stig_id": "WA000-WWA026 A22"
  tag "nist": ["CM-6", "Rev_4"]

  tag "check": "To view the worker_processes directive value enter the
  following command:
  grep ""worker_processes"" on the nginx.conf file and any separate included
  configuration files
  If the value of ""worker_processes"" is not set to auto or explicitly set,
  this is a finding:
  worker_processes   auto;
  worker_processes defines the number of worker processes. The optimal value
  depends on many factors including (but not limited to) the number of CPU
  cores, the number of hard disk drives that store data, and load pattern. When
  one is in doubt, setting it to the number of available CPU cores would be a
  good start (the value “auto” will try to autodetect it)."

  tag "fix": "Edit the configuration file and set the value of
  ""worker_processes"" to the value of auto or a value of 1 or higher:
  worker_processes auto;"

  describe nginx_conf(NGINX_CONF_FILE).params['worker_processes'] do
    it { should cmp [['auto']] }
  end
end
```

### 2.3. InSpec Results
#### 2.3.1. Failure
![Alt text](../images/InSpec_Failure.png?raw=true "InSpec Failure")

#### 2.3.2. Pass
![Alt text](../images/InSpec_Pass.png?raw=true "InSpec Pass")

#### 2.3.3. Multiple Controls
![Alt text](../images/InSpec_Multiple_Controls.png?raw=true "InSpec Multiple Controls")

### 2.4. Tooling and Reporting
![Alt text](../images/Tooling_Reporting.png?raw=true "Tooling Reporting")

### 2.5. InSpec Resources
PLACEHOLDER
![Alt text](../images/InSpec_Pass.png?raw=true "InSpec Resource example")


## 3. Recap of an InSpec profile
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



### 3.1. Understanding the profile structure

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



### 3.2. Understand a control's structure

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

In Ruby, the `do` and `end` keywords define a `block`. An InSpec control always contains at least one `describe` block. However, a control can contain many `describe` blocks.
::: tip More information on a block
[block](http://ruby-for-beginners.rubymonstas.org/blocks.html)
:::


### 3.3. Understand a describe block's structure

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
#### 3.3.1. file

[file](https://www.inspec.io/docs/reference/resources/file/) is an InSpec [resource](https://www.inspec.io/docs/reference/resources/). If you're familiar with Chef, you know that a resource configures one part of the system. InSpec resources are similar. For example, the InSpec file resource tests for file attributes, including a file's owner, mode, and permissions. The example examines the /tmp directory.

---
#### 3.3.2. it

The `it` statement validates one of your resource's features. A `describe` block contains one or more `it` statements. `it` enables you to test the resource itself. You'll also see `its`, which describes some feature of the resource, such as its mode or owner. You'll see examples of both `it` and `its` shortly.

---
#### 3.3.3. should

`should` describes the expectation. `should` asserts that the condition that follows _should_ be true. Alternatively, `should_not` asserts that the condition that follows _should not_ be true. You'll see examples of both shortly.

---
#### 3.3.4. be_directory

`be_directory` is an example of a [matcher](https://www.inspec.io/docs/reference/matchers/). A matcher compares a resource's actual value to its expected value. InSpec provides several predefined matchers. The `file` resource provides the `be_directory` matcher.



## 4. Exploring InSpec Resources

Before we dive into the course we want to take a look into what is a resource.

When writing InSpec code, many resources are available to you.

* You can [explore the InSpec resources](https://www.inspec.io/docs/reference/resources/) to see which resources are available.
* You can [examine the source code](https://github.com/inspec/inspec/tree/master/lib/inspec/resources) to see what's available. For example, you can see how file and other InSpec resources are implemented.

There's also [Resource DSL](https://www.inspec.io/docs/reference/dsl_resource/), which gives a brief overview of how.




### 4.1. Resource Overview

Resources may be added to profiles in the libraries folder:
```bash
$ tree examples/profile
examples/profile
...
├── libraries
│   └── gordon_config.rb
```


### 4.2. Resource Structure
The smallest possible resource takes this form:

```ruby
class Tiny < Inspec.resource(1)
  name 'tiny'
end
```

Resources are written as a regular Ruby class which inherits from Inspec.resource. The number (1) specifies the version this resource plugin targets. As Chef InSpec evolves, this interface may change and may require a higher version.

The following attributes can be configured:

name - Identifier of the resource (required)
desc - Description of the resource (optional)
example - Example usage of the resource (optional)
supports - (Chef InSpec 2.0+) Platform restrictions of the resource (optional)
The following methods are available to the resource:

inspec - Contains a registry of all other resources to interact with the operating system or target in general.
skip_resource - A resource may call this method to indicate that requirements aren’t met. All tests that use this resource will be marked as skipped.

The following example shows a full resource using attributes and methods to provide simple access to a configuration file:
```ruby
class GordonConfig < Inspec.resource(1)
  name 'gordon_config'

  # Restrict to only run on the below platforms (if none were given, all OS's supported)
  supports platform_family: 'fedora'
  supports platform: 'centos', release: '6.9'
  # Supports `*` for wildcard matcher in the release
  supports platform: 'centos', release: '7.*'

  desc '
    Resource description ...
  '

  example '
    describe gordon_config do
      its("signal") { should eq "on" }
    end
  '

  # Load the configuration file on initialization
  def initialize(path = nil)
    @path = path || '/etc/gordon.conf'
    @params = SimpleConfig.new( read_content )
  end

  # Expose all parameters of the configuration file.
  def method_missing(name)
    @params[name]
  end

  private

  def read_content
    f = inspec.file(@path)
    # Test if the path exist and that it's a file
    if f.file?
      # Retrieve the file's contents
      f.content
    else
      # If the file doesn't exist, skip all tests that use gordon_config
      raise Inspec::Exceptions::ResourceSkipped, "Can't read config at #{@path}"
    end
  end
end
```

### 4.3. Explore the file resource

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



### 4.4. Explore the nginx resource

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



### 4.5. Write the InSpec controls

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



### 4.6. Refactor the code to use Attributes
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

#### 4.6.1. Multiple Attribute Example

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



### 4.7. Running baseline straight from Github/Chef Supermarket
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

## 5. Viewing and Analyzing Results

InSpec allows you to output your test results to one or more reporters. You can configure the reporter(s) using either the --json-config option or the --reporter option. While you can configure multiple reporters to write to different files, only one reporter can output to the screen(stdout).
```
$ inspec exec /root/my_nginx -t ssh://TARGET_USERNAME:TARGET_PASSWORD@TARGET_IP --reporter cli json:baseline_output.json
```

### 5.1. Syntax

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

### 5.2. Supported Reporters

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

### 5.3. Putting it all together
The following command will run the nginx baseline profile from github and use the reporter to output a json, you will need this for the next step loading it into heimdall:


` $ inspec exec https://github.com/dev-sec/nginx-baseline -t ssh://TARGET_USERNAME:TARGET_PASSWORD@TARGET_IP --reporter cli json:baseline_output.json`

## 6. Automation Tools
Navigate to the web page for [Heimdall Lite](https://mitre.github.io/heimdall-lite/)

Click on the button `Load Json`
![Alt text](../images/Heimdall_Load.png?raw=true "Heimdall Load")

Click on the button `Browse`
![Alt text](../images/Heimdall_Browse.png?raw=true "Heimdall Browse")

Navigate to your json output file that you saved from your previous step and select that file then click open.

This will allow you to view the InSpec results in the Heimdall viewer.


## 7. Additional InSpec tricks
### 7.1. rspec Explicit Subject
Here we have a inspec test that lists out it's current directory. Our original test code looks like this
```ruby
describe command('ls -al').stdout.strip do
  it { should_not be_empty }
end
```

If we would like to have a more [Explicit Subject](https://relishapp.com/rspec/rspec-core/docs/subject/explicit-subject) then we could refactor the code like this example
```ruby
describe "this is a detailed message" do
  subject { command('ls -al').stdout.strip }
  it{ should_not be_empty }
end
```

### 7.2. looping file structure
For looping through a file directory, the directory resource is not powerful enough to do that, so we are required to use the `command` resource and run a `find` or it's equivalent for your target OS. This can be very resource intensive on your target so try to be as specific as possible with your search such as the example below:
```ruby
command('find ~/* -type f -maxdepth 0 -xdev').stdout.split.each do |fname|
  describe file(fname) do
    its('owner') { should cmp 'ec2-user' }
  end
end
```

## 8. Create basic profile - DAY 2
### 8.1. Download STIG Requirements Here
Download the latest STIG Viewer located here [STIG Viewer](https://iase.disa.mil/stigs/pages/stig-viewing-guidance.aspx)
![Alt text](../images/Download_STIG_Viewer.png?raw=true "STIG Viewer Download")


Download the `Red Hat 6 STIG - Ver 1, Rel 21` located here [RHEL6 STIG Download](https://iase.disa.mil/stigs/Pages/a-z.aspx)
![Alt text](../images/Download_STIG.png?raw=true "RHEL6 STIG Download")



### 8.2. Example Control V-38437
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
### 8.3. Getting Started on the RHEL6 baseline

__Controls we will demo:__
- V-38451 <---file resource
- V-38472 <---directory looping & command resource
- V-38473 <---mount resource
- V-38595 <---manual test
- V-38599 <---non applicable use case & package resource & command resource & parse config file resource

__Suggested Controls to start on (Simple):__
- V-38450 <---file resource
- V-38469 <---directory looping & command resource
- V-38456 <---mount resource
- V-38659 <---manual test

__Suggested Controls to start on (Hard):__
- V-38446 <---parse config & command
- V-38464 <---parse config file
- V-38490 <---kernel module
- V-38537 <---kernel parameter
- V-38576 <---file content
- V-38474 <---non applicable use case

__Suggested InSpec Resources to use:__
- [command](https://www.inspec.io/docs/reference/resources/command/)
- [file](https://www.inspec.io/docs/reference/resources/file/)
- [directory](https://www.inspec.io/docs/reference/resources/directory/)
- [parse_config_file](https://www.inspec.io/docs/reference/resources/parse_config_file/)
- [kernel_module](https://www.inspec.io/docs/reference/resources/kernel_module/)
- [package](https://www.inspec.io/docs/reference/resources/package/)

### 8.4. Completed RHEL6 Profile for Reference

Below is the url to the completed RHEL6 Inspec Profile for reference.  
[red-hat-enterprise-linux-6-stig-baseline](https://github.com/mitre/red-hat-enterprise-linux-6-stig-baseline)



## 9. Using what you've learned

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



## 10. Cleanup Environments
If you're done with your vagrant boxes, run the following command to destroy them:
`vagrant destroy -f`


## 11. Additional Resources

### 11.1 Security Guidance
[https://iase.disa.mil/stigs/Pages/a-z.aspx](https://iase.disa.mil/stigs/Pages/a-z.aspx)  
[https://www.cisecurity.org/cis-benchmarks/](https://www.cisecurity.org/cis-benchmarks/)  

### 11.2 InSpec Documentation
[InSpec Docs](https://www.inspec.io/docs/)  
[InSpec Profiles](https://www.inspec.io/docs/reference/profiles/)  
[InSpec Resources](https://www.inspec.io/docs/reference/resources/)  
[InSpec Matchers](https://www.inspec.io/docs/reference/matchers/)  
[InSpec Shell](https://www.inspec.io/docs/reference/shell/)  
[InSpec Reporters](https://www.inspec.io/docs/reference/reporters/)  
[InSpec Profile Inheritance](https://blog.chef.io/2017/07/06/understanding-inspec-profile-inheritance/)  

### 11.3 Additional Tutorials
[What to Expect When You’re InSpec’ing](https://blog.chef.io/2018/04/03/what-to-expect-when-youre-inspecing/)  
[Getting started with InSpec - The InSpec basics series](http://www.anniehedgie.com/inspec/)  
[Windows infrastructure testing using InSpec – Part I](http://datatomix.com/?p=236)  
[Windows infrastructure testing using InSpec and Profiles – Part II](http://datatomix.com/?p=238)  

### 11.4 MITRE InSpec
[MITRE InSpec Repositories](https://github.com/orgs/mitre/teams/inspec/repositories)  
[InSpec Tools](https://github.com/mitre/inspec_tools)  
[Heimdall Lite](https://mitre.github.io/heimdall-lite/#)  

### 11.5. rspec documentation
[Explicit Subject](https://relishapp.com/rspec/rspec-core/docs/subject/explicit-subject)  
[should and should_not](https://github.com/rspec/rspec-expectations/blob/master/Should.md)  
[Built in matchers](https://relishapp.com/rspec/rspec-expectations/docs/built-in-matchers)  

### 11.6. Slack
[Chef Slack](http://community-slack.chef.io/)  
