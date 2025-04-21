import { Resend } from 'resend';


  try {
    const { data, error } = await resend.emails.send({
      from: 'UoG Job Portal <noreply@uogjobportal.edu.et>',
      to: email,
      subject: 'Verify your email address',
      html: emailHtml,
    });

    if (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }

    return data;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
} 


  try {
    const { data, error } = await resend.emails.send({
      from: 'UoG Job Portal <noreply@uogjobportal.edu.et>',
      to: email,
      subject: 'Verify your email address',
      html: emailHtml,
    });

    if (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }

    return data;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
}