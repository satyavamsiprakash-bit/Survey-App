
export interface Attendee {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  profession: string;
  businessChallenges: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}