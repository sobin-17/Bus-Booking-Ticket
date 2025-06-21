import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';

interface BookingStep {
  title: string;
  description: string;
  time: string;
}

@Component({
  selector: 'app-learn',
  imports:[CommonModule],
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.css']
})
export class LearnComponent implements OnInit {
  
  // Active tab state
  activeTab: string = 'overview';
  
  // Booking steps data
  bookingSteps: BookingStep[] = [
    {
      title: 'Search Routes',
      description: 'Enter your source and destination cities with travel date',
      time: '30 seconds'
    },
    {
      title: 'Select Bus',
      description: 'Choose from available buses based on timing and amenities',
      time: '1 minute'
    },
    {
      title: 'Choose Seats',
      description: 'Pick your preferred seats from the seat layout',
      time: '30 seconds'
    },
    {
      title: 'Make Payment',
      description: 'Complete secure payment using your preferred method',
      time: '2 minutes'
    },
    {
      title: 'Get Ticket',
      description: 'Receive instant confirmation and e-ticket via email/SMS',
      time: 'Instant'
    }
  ];

  constructor(
    private router: Router,
    private location: Location
  ) { }

  ngOnInit(): void {
    // Initialize component
    this.scrollToTop();
  }

  /**
   * Set active tab
   * @param tab - The tab to activate
   */
  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.scrollToTop();
  }

  /**
   * Navigate to booking/search page
   */
  startBooking(): void {
    // Navigate to booking page - adjust route as per your routing setup
    this.router.navigate(['/Addusers']);
  }

  /**
   * Open live chat support
   */
  openChat(): void {
    // Implement your chat functionality here
    // This could open a modal, redirect to chat page, or integrate with chat service
    console.log('Opening live chat...');
    
    // Example: Open chat in new window
    // window.open('https://your-chat-service.com', 'chat', 'width=400,height=600');
    
    // Or show a modal/toast
    alert('Live chat will be available soon! Please call our support number for immediate assistance.');
  }

  /**
   * Open FAQ page or modal
   */
  openFAQ(): void {
    // Navigate to FAQ page - adjust route as per your routing setup
    this.router.navigate(['/faq']);
  }

  /**
   * Open specific help topic
   * @param topic - The help topic to open
   */
  openHelp(topic: string): void {
    console.log(`Opening help for: ${topic}`);
    
    // You can implement different actions based on topic
    switch(topic) {
      case 'cancellation':
        this.router.navigate(['/help/cancellation']);
        break;
      case 'refund':
        this.router.navigate(['/help/refund']);
        break;
      case 'payment':
        this.router.navigate(['/help/payment']);
        break;
      case 'booking':
        this.router.navigate(['/help/booking']);
        break;
      case 'account':
        this.router.navigate(['/help/account']);
        break;
      case 'mobile':
        this.router.navigate(['/help/mobile-app']);
        break;
      default:
        this.router.navigate(['/help']);
    }
  }

  /**
   * Navigate back to previous page or home
   */
  goBack(): void {
    // Check if there's a previous page in history
    if (window.history.length > 1) {
      this.location.back();
    } else {
      // Navigate to home page
      this.router.navigate(['/']);
    }
  }

  /**
   * Scroll to top of page
   */
  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Handle phone call
   */
  callSupport(): void {
    // This will trigger the phone dialer on mobile devices
    window.location.href = 'tel:+911800123456';
  }

  /**
   * Handle email
   */
  emailSupport(): void {
    // This will open the default email client
    window.location.href = 'mailto:support@busbooking.com?subject=Support Request';
  }

  /**
   * Track user interactions for analytics
   * @param action - The action performed
   * @param category - The category of action
   */
  trackEvent(action: string, category: string = 'Learn Page'): void {
    // Implement your analytics tracking here
    console.log(`Analytics: ${category} - ${action}`);
    
    // Example with Google Analytics (if implemented)
    // gtag('event', action, {
    //   event_category: category,
    //   event_label: this.activeTab
    // });
  }

  /**
   * Check if current tab is active
   * @param tab - Tab to check
   * @returns boolean
   */
  isActiveTab(tab: string): boolean {
    return this.activeTab === tab;
  }

  /**
   * Get tab icon class
   * @param tab - Tab name
   * @returns string - Font Awesome icon class
   */
  getTabIcon(tab: string): string {
    const icons: { [key: string]: string } = {
      'overview': 'fa-eye',
      'features': 'fa-star',
      'booking': 'fa-ticket',
      'support': 'fa-support'
    };
    return icons[tab] || 'fa-info';
  }

  /**
   * Handle tab change with animation
   * @param tab - New tab to activate
   */
  changeTabWithAnimation(tab: string): void {
    // Add fade out class
    const contentEl = document.querySelector('.fade-in');
    if (contentEl) {
      contentEl.classList.add('fade-out');
      
      setTimeout(() => {
        this.setActiveTab(tab);
        contentEl.classList.remove('fade-out');
      }, 150);
    } else {
      this.setActiveTab(tab);
    }
    
    // Track tab change
    this.trackEvent(`Tab Changed to ${tab}`, 'Navigation');
  }
}