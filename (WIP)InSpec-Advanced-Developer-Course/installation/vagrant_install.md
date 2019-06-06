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
![Alt text](../../images/Create_NatNetwork.png?raw=true "Create NatNetwork")

Click ok to save the settings.

The following step you will repeat for the 3 vm's `workstation`, `target`, `target-centos6`.
 - Select the virtual machine
 - Click on settings for the virtual machine
 - Navigate to the network tab
 - For `Attached to:` Select `NatNetwork`
 - For `Name` make sure the same NatNetwork is selected for all the virtual machines
 - Click on Advanced dropdown and For `Promiscuous Mode:` make sure to select `Allow VMs`
 - Once you do these steps your preferences should look like this below:

 ![Alt text](../../images/NatNetwork_VM_Setup.png?raw=true "NatNetwork VM Setup")

 - Next you need to Select the Shared Folders
 - Click the + symbol to add a new Shared Folder
 ![Alt text](../../images/Add_Shared_Folder.png?raw=true "Add Shared Folder")
 - For Folder Path select the dropdown and select `Other`, navigate to your `~/learn-inspec` folder and select that
 ![Alt text](../../images/Select_Shared_Folder.png?raw=true "Select Shared Folder")
 - Select the checkbox for Auto-mount
 ![Alt text](../../images/Configure_Shared_Folder.png?raw=true "Configure Shared Folder")
 - Click ok to confirm the shared folder.
 - Once you do these steps your preferences should look like this below:
![Alt text](../../images/Final_Shared_Folder.png?raw=true "Final Shared Folder")
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

