const mongoose = require('mongoose');
require('dotenv').config();

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  event_date: { type: Date, required: true },
  location: String,
  status: { type: String, enum: ['upcoming', 'ongoing', 'completed'], default: 'upcoming' },
  image_url: String,
  registration_url: String,
  branch: { type: String, required: true },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

async function updateEventsWithBranch() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all events without branch
    const events = await Event.find({ branch: { $exists: false } });
    console.log(`Found ${events.length} events without branch`);

    // Update each event with a default branch based on location or assign randomly
    const branches = [
      'Gujarat University',
      'NIT Surat', 
      'IIT Gandhinagar',
      'DA-IICT Gandhinagar',
      'SVNIT Surat',
      'Nirma University'
    ];

    for (const event of events) {
      let branch = 'Gujarat University'; // default
      
      // Try to determine branch from location
      if (event.location) {
        const location = event.location.toLowerCase();
        if (location.includes('surat')) branch = 'NIT Surat';
        else if (location.includes('gandhinagar')) branch = 'IIT Gandhinagar';
        else if (location.includes('daiict') || location.includes('da-iict')) branch = 'DA-IICT Gandhinagar';
        else if (location.includes('svnit')) branch = 'SVNIT Surat';
        else if (location.includes('nirma')) branch = 'Nirma University';
        else if (location.includes('anand')) branch = 'Gujarat University';
      }

      event.branch = branch;
      await event.save();
      console.log(`Updated event "${event.title}" with branch: ${branch}`);
    }

    console.log('✅ All events updated with branch information');

  } catch (error) {
    console.error('❌ Error updating events:', error);
  } finally {
    await mongoose.disconnect();
  }
}

updateEventsWithBranch();