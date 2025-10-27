const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('../models/User');
const { Member, ExecutiveCommittee } = require('../models/Website');

const realBranchData = {
  // Real IEEE SPS Gujarat Chapter Executive Committee
  executiveCommittee: [
    {
      name: "Dr. Manjunath V. Joshi",
      position: "Chair",
      email: "mvjoshi@daiict.ac.in",
      institution: "DA-IICT, Gandhinagar",
      bio: "Professor at DA-IICT with expertise in Signal Processing and Computer Vision",
      order: 1,
      is_active: true
    },
    {
      name: "Dr. Suman K. Mitra",
      position: "Vice Chair",
      email: "suman@daiict.ac.in", 
      institution: "DA-IICT, Gandhinagar",
      bio: "Associate Professor specializing in Digital Signal Processing",
      order: 2,
      is_active: true
    },
    {
      name: "Dr. Mehul S. Raval",
      position: "Secretary",
      email: "mraval@ahmedabaduniversity.edu.in",
      institution: "Ahmedabad University",
      bio: "Professor with research interests in Computer Vision and Machine Learning",
      order: 3,
      is_active: true
    },
    {
      name: "Dr. Tanish Zaveri",
      position: "Treasurer",
      email: "tanish.zaveri@nirmauni.ac.in",
      institution: "Nirma University, Ahmedabad",
      bio: "Professor in Electronics and Communication Engineering",
      order: 4,
      is_active: true
    },
    {
      name: "Dr. Asim Banerjee",
      position: "Membership Development Chair",
      email: "asim.banerjee@nirmauni.ac.in",
      institution: "Nirma University, Ahmedabad", 
      bio: "Associate Professor with expertise in Signal Processing",
      order: 5,
      is_active: true
    },
    {
      name: "Dr. Suprava Patnaik",
      position: "Awards Chair",
      email: "suprava@svnit.ac.in",
      institution: "SVNIT, Surat",
      bio: "Professor in Electronics Engineering Department",
      order: 6,
      is_active: true
    }
  ],

  // Student Branch Administrators
  branchAdmins: [
    {
      name: "Prof. Amit Patel",
      email: "amit.patel@gujaratuni.ac.in",
      password: "TempPass123!",
      role: "branch_admin",
      branch: "Gujarat University",
      permissions: ["events", "content", "members"],
      profile: {
        phone: "+91-9876543210",
        institution: "Gujarat University",
        designation: "Assistant Professor"
      }
    },
    {
      name: "Dr. Priya Shah",
      email: "priya.shah@nitsurat.ac.in", 
      password: "TempPass123!",
      role: "branch_admin",
      branch: "NIT Surat",
      permissions: ["events", "content", "research"],
      profile: {
        phone: "+91-9876543211",
        institution: "NIT Surat",
        designation: "Associate Professor"
      }
    },
    {
      name: "Prof. Rajesh Kumar",
      email: "rajesh.kumar@iitgn.ac.in",
      password: "TempPass123!",
      role: "branch_admin", 
      branch: "IIT Gandhinagar",
      permissions: ["all"],
      profile: {
        phone: "+91-9876543212",
        institution: "IIT Gandhinagar",
        designation: "Professor"
      }
    },
    {
      name: "Dr. Neha Joshi",
      email: "neha.joshi@daiict.ac.in",
      password: "TempPass123!",
      role: "branch_admin",
      branch: "DA-IICT Gandhinagar", 
      permissions: ["events", "content", "members", "research"],
      profile: {
        phone: "+91-9876543213",
        institution: "DA-IICT",
        designation: "Assistant Professor"
      }
    },
    {
      name: "Prof. Kiran Patel",
      email: "kiran.patel@svnit.ac.in",
      password: "TempPass123!",
      role: "branch_admin",
      branch: "SVNIT Surat",
      permissions: ["events", "content"],
      profile: {
        phone: "+91-9876543214", 
        institution: "SVNIT Surat",
        designation: "Assistant Professor"
      }
    },
    {
      name: "Dr. Ravi Sharma",
      email: "ravi.sharma@nirmauni.ac.in",
      password: "TempPass123!",
      role: "branch_admin",
      branch: "Nirma University",
      permissions: ["events", "content", "members"],
      profile: {
        phone: "+91-9876543215",
        institution: "Nirma University", 
        designation: "Associate Professor"
      }
    }
  ],

  // Active Members from various institutions
  members: [
    {
      name: "Dr. Anil Kumar Tiwari",
      email: "anil.tiwari@gujaratuni.ac.in",
      position: "Professor",
      department: "Electronics Engineering",
      institution: "Gujarat University",
      bio: "Research interests in Digital Signal Processing and Communication Systems",
      is_active: true
    },
    {
      name: "Dr. Bhavesh Patel",
      email: "bhavesh.patel@nitsurat.ac.in", 
      position: "Associate Professor",
      department: "Electronics and Communication",
      institution: "NIT Surat",
      bio: "Expertise in Image Processing and Computer Vision",
      is_active: true
    },
    {
      name: "Dr. Chandni Shah",
      email: "chandni.shah@pdpu.ac.in",
      position: "Assistant Professor", 
      department: "Information and Communication Technology",
      institution: "Pandit Deendayal Energy University",
      bio: "Research focus on Machine Learning and Signal Processing",
      is_active: true
    },
    {
      name: "Prof. Deepak Mishra",
      email: "deepak.mishra@iitgn.ac.in",
      position: "Professor",
      department: "Electrical Engineering",
      institution: "IIT Gandhinagar", 
      bio: "Signal Processing for Wireless Communications",
      is_active: true
    },
    {
      name: "Dr. Ekta Patel",
      email: "ekta.patel@daiict.ac.in",
      position: "Assistant Professor",
      department: "Information and Communication Technology", 
      institution: "DA-IICT",
      bio: "Computer Vision and Pattern Recognition",
      is_active: true
    }
  ]
};

async function initRealBranchData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await ExecutiveCommittee.deleteMany({});
    await Member.deleteMany({});
    await User.deleteMany({ role: { $ne: 'super_admin' } });

    console.log('Cleared existing data');

    // Insert Executive Committee
    for (const member of realBranchData.executiveCommittee) {
      const execMember = new ExecutiveCommittee(member);
      await execMember.save();
    }
    console.log(`Inserted ${realBranchData.executiveCommittee.length} executive committee members`);

    // Insert Members
    for (const member of realBranchData.members) {
      const newMember = new Member(member);
      await newMember.save();
    }
    console.log(`Inserted ${realBranchData.members.length} members`);

    // Insert Branch Administrators
    for (const admin of realBranchData.branchAdmins) {
      const user = new User(admin);
      await user.save();
    }
    console.log(`Inserted ${realBranchData.branchAdmins.length} branch administrators`);

    console.log('✅ Real branch data initialization completed successfully!');
    console.log('\n📧 Branch Admin Login Credentials:');
    realBranchData.branchAdmins.forEach(admin => {
      console.log(`${admin.branch}: ${admin.email} / TempPass123!`);
    });
    console.log('\n⚠️  Please ask branch admins to change their passwords after first login');

  } catch (error) {
    console.error('❌ Error initializing data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run if called directly
if (require.main === module) {
  initRealBranchData();
}

module.exports = { initRealBranchData, realBranchData };